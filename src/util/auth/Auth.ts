import { AuthenticateOptions, Authenticator } from "remix-auth";
import { redirect, Request, SessionStorage } from "@remix-run/node";
import { authBuilder } from "./authBuilder";
import { API } from "../api";
import { arrayify, Class } from "@encode42/mantine-extras";
import { Strategy } from "remix-auth/build/strategy";
import { storageBuilder, storageBuilderProps } from "../session";
import { APIProp } from "../interface";

/**
 * Options for the {@link Auth} class.
 */
export interface AuthProps extends APIProp {
    /**
     * Secret for the stored cookies.
     *
     * Defaults to the {@code COOKIE_AUTH_SECRET} environment variable.
     */
    "secret"?: storageBuilderProps["secret"]
}

/**
 * Options for the {@link from} function.
 */
export interface fromProps extends AuthProps {
    /**
     * Array of providers to register.
     *
     * @see register
     */
    "providers": registerProps<unknown>[]
}

/**
 * Options for the {@link Auth.getAccount} function.
 */
export interface getAccountOptions {
    /**
     * Whether to redirect the user on authentication failure.
     */
    "failureRedirect"?: boolean
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
     * Defaults to {@code provider}'s value.
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
 * A class to handle user authentication.
 */
export class Auth<User = unknown> {
    /**
     * Create an {@link Auth} instance from an array of {@link registerProps providers}.
     */
    public static from<User>({ secret, api, providers }: fromProps) {
        const auth = new Auth<User>({
            secret,
            api
        });

        for (const provider of arrayify(providers)) {
            auth.register(provider);
        }

        return auth;
    }

    /**
     * {@link https://github.com/sergiodxa/remix-auth#usage= Authenticator} instance to utilize.
     */
    private readonly authenticator: Authenticator<User>;

    /**
     * {@link https://remix.run/docs/en/v1/api/remix#createsessionstorage SessionStorage} instance to utilize.
     *
     * @see storageBuilder
     */
    private readonly sessionStorage: SessionStorage;

    /**
     * {@link API} instance to utilize.
     */
    private readonly api: API;

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

    constructor({ secret, api }: AuthProps) {
        // Create the session storage and authenticator
        this.sessionStorage = storageBuilder({
            "name": "_auth",
            "secret": secret
        });

        this.authenticator = authBuilder<User>({
            "sessionStorage": this.sessionStorage
        });

        this.api = api;

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
                    "failureRedirect": "/login"
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
     */
    public async logout(request: Request) {
        await this.authenticator.logout(request, {
            "redirectTo": "/"
        });
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
