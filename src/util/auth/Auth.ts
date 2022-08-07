import { AuthenticateOptions, Authenticator } from "remix-auth";
import { Headers, HeadersInit, redirect, Request, SessionStorage } from "@remix-run/node";
import { authBuilder } from "./authBuilder";
import { API } from "../api";
import { arrayify, Class } from "@encode42/mantine-extras";
import { Strategy } from "remix-auth/build/strategy";
import { APIProp } from "../interface";
import { storageBuilder } from "../session";
import deepmerge from "deepmerge";

/**
 * Options for the {@link Auth} class.
 */
export interface AuthProps extends APIProp {
    /**
     * [SessionStorage](https://remix.run/docs/en/v1/api/remix#sessions) instance to utilize.
     *
     * @see storageBuilder
     */
    "storage"?: SessionStorage
}

/**
 * Options for the {@link Auth.from} function.
 */
export interface fromProps extends AuthProps {
    /**
     * Array of providers to register.
     *
     * @see register
     */
    "providers": registerProps<unknown>[]
}

export interface logoutOptions {
    /**
     * Path to redirect to once logged out.
     *
     * @defaultValue /
     */
    "redirectTo"?: string

    /**
     * Whether to throw a redirect function once complete, or return the redirect structure.
     *
     * @defaultValue true
     */
    "throw"?: boolean,

    /**
     * Headers to inject into the logout headers.
     */
    "headers"?: HeadersInit
}

export interface Route {
    /**
     * Default provider route.
     */
    "default": string,

    /**
     * Provider callback route.
     */
    "callback": string,

    /**
     * Full provider callback route including site name.
     */
    "fullCallback": string
}

/**
 * Shared properties for {@link RegisteredProvider} and {@link registerProps}.
 */
export interface SharedProvider {
    /**
     * Name of the provider.
     *
     * @defaultValue {@link SharedProvider.provider}'s value.
     */
    "name"?: string,

    /**
     * Provider this strategy uses.
     */
    "provider": string
}

/**
 * A registered provider.
 */
export interface RegisteredProvider extends SharedProvider {
    /**
     * The {@link Route} of the provider.
     */
    "route": Route
}

/**
 * Options for the {@link Auth.register} function.
 */
export interface registerProps<T> extends SharedProvider {
    /**
     * Class to authenticate with.
     */
    "strategy": Class<T>,

    /**
     * Function used to verify the authenticated account.
     *
     * @param user Resulting user.
     */
    "verify"?: <User = unknown>(user: User) => any,

    /**
     * Additional options for the provider.
     */
    "options": Record<string, any>
}

/**
 * Result of the {@link Auth.register} function.
 */
export interface registerResult {
    /**
     * Resulting routes.
     */
    "route": Route
}

/**
 * Function to get properties from a user.
 */
export type LoaderProcess<User> = (user: User) => {
    /**
     * Username of the user.
     */
    "username": string,

    /**
     * Profile picture URL of the user.
     */
    "profilePicture": string
}

/**
 * Context object provided by a registered provider's `action`.
 */
export interface Context {
    /**
     * Request for the action.
     */
    "request": Request
}

/**
 * A class to handle user authentication.
 */
export class Auth<User = unknown> {
    /**
     * Create an {@link Auth} instance from an array of {@link registerProps providers}.
     */
    public static from<User>({ storage, api, providers }: fromProps) {
        const auth = new Auth<User>({
            storage,
            api
        });

        for (const provider of arrayify(providers)) {
            auth.register(provider);
        }

        return auth;
    }

    /**
     * [Authenticator](https://github.com/sergiodxa/remix-auth#usage) instance to utilize.
     */
    private readonly authenticator: Authenticator<User>;

    /**
     * {@link API} instance to utilize.
     */
    private readonly api: API;

    /**
     * [SessionStorage](https://remix.run/docs/en/v1/api/remix#createsessionstorage) instance to utilize.
     *
     * @see storageBuilder
     */
    private readonly storage: SessionStorage;

    /**
     * The route used to log a user out.
     */
    public readonly logoutRoute: string;

    /**
     * An array of providers registered to this instance.
     *
     * @see register
     */
    public readonly registeredProviders: RegisteredProvider[] = [];

    constructor({ storage, api }: AuthProps) {
        this.api = api;

        // Create the session storage if not provided
        this.storage = storage;

        // Create the authenticator
        this.authenticator = authBuilder<User>({
            "storage": this.storage
        });

        // Register the logout route
        this.logoutRoute = this.api.format(false, "auth", "logout");
        this.api.register({
            "route": this.logoutRoute,
            "type": "action",
            "callback": async ({ request }) => {
                return await this.logout(request);
            }
        });
    }

    /**
     * Get the current account from a request.
     */
    public async getAccount(request: Request) {
        return await this.authenticator.isAuthenticated(request);
    }

    /**
     * Get the current account from a request and redirect on failure.
     */
    public async requiredAccount(request: Request) {
        return await this.authenticator.isAuthenticated(request, {
            "failureRedirect": "/login"
        });
    }

    /**
     * Register a new OAuth2 strategy.
     *
     * @remarks
     * Automatically handles provider and callback routes!
     * This relies on a proper {@link API} splat setup.
     */
    public register<T extends Strategy<User, never>>({ strategy, verify, provider, name, options }: registerProps<T>): registerResult {
        const defaultURL = this.api.format(false, "auth", "provider", provider);
        const callbackURL = this.api.format(false, "auth", "callback", provider);

        const fullCallback = this.api.format(true, "auth", "callback", provider);

        // Register the default provider loader route
        this.api.register({
            "route": defaultURL,
            "type": "loader",
            "callback": () => {
                return redirect("/login");
            }
        });

        // Register the default provider action route
        this.api.register<Promise<User>>({
            "route": defaultURL,
            "type": "action",
            "callback": ({ request, param }) => {
                return this.auth(request, param);
            }
        });

        // Register the callback provider loader route
        this.api.register<Promise<User>>({
            "route": callbackURL,
            "type": "loader",
            "callback": ({ request, param }) => {
                return this.auth(request, param, {
                    "successRedirect": "/",
                    "failureRedirect": "/login",
                    "context": {
                        request
                    } as Context
                });
            }
        });

        // Register the authentication strategy
        this.authenticator.use(new strategy({
            ...options,
            "callbackURL": fullCallback
        }, async user => {
            if (!verify) {
                return user;
            }

            return await verify?.(user);
        }));

        // Add to the stored providers
        const route = {
            "default": defaultURL,
            "callback": callbackURL,
            "fullCallback": fullCallback
        };

        this.registeredProviders.push({
            "name": name ?? provider,
            provider,
            route
        });

        return {
            route
        };
    }

    /**
     * Get a registered provider from its name or provider.
     *
     * @param name Name or provider to get
     */
    public getProvider(name: string) {
        let found: RegisteredProvider;

        for (const provider of this.registeredProviders) {
            if (provider.provider === name || provider.name === name) {
                found = provider;
                break;
            }
        }

        return found;
    }

    /**
     * Authenticate a request with a provider.
     *
     * @param request Request to authenticate
     * @param provider Registered provided to authenticate with
     * @param options Authenticator options
     */
    public async auth(request: Request, provider: string, options?: Pick<AuthenticateOptions, "successRedirect" | "failureRedirect" | "throwOnError" | "context">) {
        return this.authenticator.authenticate(provider, request, options);
    }

    /**
     * Log a user out.
     *
     * @param request Request to logout
     * @param options Logout options
     */
    public async logout(request: Request, options: logoutOptions = {}) {
        options = deepmerge({
            "redirectTo": "/",
            "throw": true
        } as logoutOptions, options);


        // This part is mostly taken from remix-auth's logout function
        const session = await this.storage.getSession(request.headers.get("Cookie"));

        const headers = new Headers(options.headers);
        headers.append("Set-Cookie", await this.storage.destroySession(session));

        const structure = {
            "url": options.redirectTo,
            "init": {
                headers
            }
        };

        if (options.throw) {
            throw redirect(structure.url, structure.init);
        } else {
            return structure;
        }
    }

    /**
     * Loader function to get a user's username, profile picture, and logout route.
     *
     * @param request Request to load
     * @param process {@link LoaderProcess} function to process with
     */
    public async loader(request: Request, process: LoaderProcess<User>) {
        const user = await this.getAccount(request);

        return user ? {
            ...process(user),
            "logoutRoute": this.logoutRoute
        } : null;
    }
}
