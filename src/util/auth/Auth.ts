import { Authenticator } from "remix-auth";
import { SessionStorage } from "@remix-run/node";
import { storageBuilder, storageBuilderProps } from "./storageBuilder";
import { authBuilder } from "./authBuilder";
import { OAuth2Strategy } from "remix-auth-oauth2";
import { API } from "../api";
import { Class } from "@encode42/mantine-extras";

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
    "failureRedirect": boolean
}

/**
 * A class to handle user authentication.
 */
export class Auth<T = void> {
    private readonly authenticator: Authenticator;
    private readonly sessionStorage: SessionStorage;
    private readonly api: API;

    constructor({ secret, api }: AuthProps) {
        this.sessionStorage = storageBuilder({
            "secret": secret
        });

        this.authenticator = authBuilder<T>({
            "sessionStorage": this.sessionStorage
        });

        this.api = api;
    }

    /**
     * Get the current account from a request.
     */
    public async getAccount(request: Request, options: getAccountOptions) {
        return await this.authenticator.isAuthenticated(request, {
            "failureRedirect": options.failureRedirect ? "/" : undefined
        });
    }

    /**
     * Register a new OAuth2 strategy.
     *
     * @param strategy Class to authenticate with
     * @param verify Function used to register the user
     * @param provider Provider this strategy uses
     * @example {@code SocialsProvider.GITHUB}
     * @param options Additional options for the provider
     */
    public use<S extends OAuth2Strategy<T, any>>(strategy: Class<S>, verify: (T) => any, provider: string, options: Record<string, any>) {
        this.authenticator.use(new strategy({
            ...options,
            "callbackURL": this.api.format("auth", provider, "callback")
        }, verify));
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
