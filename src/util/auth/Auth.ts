import { Authenticator } from "remix-auth";
import { redirect, SessionStorage } from "@remix-run/node";
import { storageBuilder, storageBuilderProps } from "./storageBuilder";
import { authBuilder } from "./authBuilder";
import { OAuth2Strategy } from "remix-auth-oauth2";
import { API } from "../api";
import { Class } from "@encode42/mantine-extras";
import { Strategy } from "remix-auth/build/strategy";

/**
 * Options for the {@link Auth} class.
 */
export interface AuthProps extends storageBuilderProps {
    /**
     * {@link API} instance to make requests with.
     */
    api: API
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

/**
 * Options for the {@link Auth.register} function.
 */
export interface registerProps<T, User> {
    /**
     * Class to authenticate with.
     */
    "strategy": Class<T>,

    /**
     * Provider this strategy uses.
     */
    "provider": string,

    /**
     * Function used to verify the authenticated account.
     *
     * @param user Resulting user.
     */
    "verify"?: (user: User) => any,

    /**
     * Additional options for the provider.
     */
    "options": Record<string, any>
}

export interface registerResult {
    "route": {
        "default": string,
        "callback": string
    }
}

/**
 * A class to handle user authentication.
 */
export class Auth<User = unknown> {
    private readonly authenticator: Authenticator<User>;
    private readonly sessionStorage: SessionStorage;
    private readonly api: API;

    public logoutRoute: string;

    constructor({ secret, api }: AuthProps) {
        this.sessionStorage = storageBuilder({
            "secret": secret
        });

        this.authenticator = authBuilder<User>({
            "sessionStorage": this.sessionStorage
        });

        this.api = api;

        this.logoutRoute = this.api.format("auth", "logout");
        this.api.register({
            "route": this.logoutRoute,
            "type": "action",
            "callback": ({ request }) => {
                this.logout(request);
            }
        });
    }

    /**
     * Get the current account from a request.
     */
    public async getAccount(request: Request, options?: getAccountOptions) {
        options = {
            "failureRedirect": false,
            ...options
        };

        return await this.authenticator.isAuthenticated(request, {
            "failureRedirect": options.failureRedirect ? "/" : undefined
        });
    }

    /**
     * Register a new OAuth2 strategy.
     */
    public register<T extends Strategy<User, never>>({ strategy, verify, provider, options }: registerProps<T, User>): registerResult {
        const defaultURL = this.api.format("auth", `provider?p=${provider}`);
        const callbackURL = this.api.format("auth", `callback?p=${provider}`);

        this.api.register({
            "route": defaultURL,
            "type": "loader",
            "callback": () => {
                return redirect("/");
            }
        });

        this.api.register<Promise<User>>({
            "route": defaultURL,
            "type": "action",
            "callback": ({ request, params }) => {
                return this.auth(request, params["p"]);
            }
        });

        this.api.register<Promise<User>>({
            "route": callbackURL,
            "type": "loader",
            "callback": ({ request, params }) => {
                return this.auth(request, params["p"]);
            }
        });

        this.authenticator.use(new strategy({
            ...options,
            callbackURL
        }, user => {
            return verify?.(user);
        }));

        return {
            "route": {
                "default": defaultURL,
                "callback": callbackURL
            }
        };
    }

    /**
     * Authenticate a request with a provider.
     *
     * @param request Request to authenticate
     * @param provider Registered provided to authenticate with
     */
    public async auth(request: Request, provider: string) {
        return this.authenticator.authenticate(provider, request);
    }

    /**
     * Log a user out.
     *
     * @param request Request to logout
     */
    public async logout(request) {
        await this.authenticator.logout(request, {
            "redirectTo": "/"
        });
    }
}
