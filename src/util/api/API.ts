import { redirect, Request, Response } from "@remix-run/node";
import { leadingSlash } from "../leadingSlash";

/**
 * Parameters for the {@link EndpointCallback} function arguments.
 */
export interface EndpointParams {
    "param": string,
    "request": Request
}

/**
 * Callback function of endpoints.
 */
export type EndpointCallback<T = unknown> = ({ param, request }: EndpointParams) => T;

/**
 * Types of available endpoint types.
 */
export type EndpointType = "action" | "loader" | "default";

/**
 * Options for the {@link API} class.
 */
export interface APIProps {
    /**
     * URL of the website.
     *
     * @defaultValue process.env.WEBSITE_URL
     */
    "websiteURL"?: string,

    /**
     * Version of the API to use.
     */
    "apiVersion"?: number,

    /**
     * Format of the endpoint.
     *
     * @remarks
     * Uses `${websiteURL}/api/v${apiVersion}/` by default.
     */
    "endpointFormat"?: string
}

/**
 * Options for the {@link registerOptions} function.
 */
export interface registerOptions<T> {
    /**
     * Route to register.
     */
    "route": string,

    /**
     * Type of endpoint to register.
     */
    "type": EndpointType,

    /**
     * Callback to execute on load.
     */
    callback: EndpointCallback<T>
}

/**
 * Options for the {@link handleOptions} function.
 */
export interface handleOptions {
    /**
     * Route to handle.
     */
    "route"?: string,

    /**
     * Type of endpoint.
     */
    "type": EndpointType,

    /**
     * Requesting client.
     */
    "request"?: Request
}

/**
 * The routes an endpoint can use.
 */
export type EndpointRoutes<T> = {
    /**
     * {@link EndpointType} that's registered.
     */
    [key in EndpointType]: {
        /**
         * Callback to execute on load.
         */
        "callback": EndpointCallback<T>
    }
}

/**
 * An API convenience class.
 *
 * @remarks
 * Routes are expected to be stored in `api/v${apiVersion}/` by default.
 *
 * The {@link register} and {@link handle} functions require a proper splat setup.
 * @example Recommended API and splat setup
 * ***
 * This file creates an API instance that persists between changes and page refreshes.
 *
 * > `app/util/api.server.ts`
 * ```js
 * import { API } from "@encode42/remix-extras";
 *
 * let api: API;
 *
 * declare global {
 *     var __api: API | undefined;
 * }
 *
 * if (process.env.NODE_ENV === "production") {
 *     api = new API({});
 * } else {
 *     if (!global.__api) {
 *         global.__api = new API({});
 *     }
 *
 *     api = global.__api;
 * }
 *
 * export { api };
 * ```
 * ***
 * This is the splat that handles all {@link register}ed routes and endpoints.
 *
 * Without this, {@link handle} wouldn't be called, and endpoints would be ignored.
 *
 * > `app/routes/api/v1/$.ts`
 * ```js
 * import { RouteOptions } from "@encode42/remix-extras";
 * import { api } from "~/util/api.server"; // Instantiated API instance
 *
 * // Handles all registered action endpoints
 * export function action({ request, params }: RouteOptions) {
 *     return api.handle({
 *         "route": params["*"],
 *         "type": "action",
 *         request
 *     });
 * }
 *
 * // Handles all registered loader endpoints
 * export function loader({ request, params }: RouteOptions) {
 *     return api.handle({
 *         "route": params["*"],
 *         "type": "loader",
 *         request
 *     });
 * }
 * ```
 */
export class API {
    /**
     * URL of the website.
     */
    private readonly websiteURL: string;

    /**
     * Version of the API route.
     */
    private readonly apiVersion: number;

    /**
     * Format for endpoints to refer to.
     */
    private readonly endpointFormat: string;

    /**
     * Map of registered endpoints.
     *
     * @see register
     * @see handle
     */
    private readonly endpoints = new Map<string, EndpointRoutes<unknown>>;

    constructor({ websiteURL = process.env.WEBSITE_URL, apiVersion = 1, endpointFormat }: APIProps) {
        this.websiteURL = websiteURL;
        this.apiVersion = apiVersion;

        this.endpointFormat = endpointFormat ?? `api/v${apiVersion}/`;
    }

    /**
     * Get the format of the API route.
     *
     * @param withURL Whether to include the website URL.
     */
    private getFormat(withURL = false) {
        if (withURL && !this.websiteURL) {
            throw new Error("The websiteURL argument or WEBSITE_URL environment variable must not be empty.");
        }

        return `${withURL ? leadingSlash(this.websiteURL, false) : ""}/${this.endpointFormat}`;
    }

    /**
     * Format an array of paths into an API path.
     */
    format(withURL, ...paths) {
        return `${this.getFormat(withURL)}${paths.join("/")}`;
    }

    /**
     * Register an API route.
     *
     * @remarks
     * This relies on a proper {@link API} splat setup.
     */
    register<T = Response>({ route, type, callback }: registerOptions<T>) {
        const format = this.getFormat(false);

        // Create a valid object from arguments
        let endpoint = {
            [type]: {
                callback
            }
        } as EndpointRoutes<T>;

        // Route already exists, so merge the types
        const existingRoute = this.endpoints.get(route);
        if (existingRoute) {
            endpoint = {
                ...existingRoute,
                ...endpoint
            };
        }

        this.endpoints.set(route.replace(format, ""), endpoint);
    }

    /**
     * Handles an API route.
     *
     * @remarks
     * Redirects to the website's index if not found.
     *
     * This relies on a proper {@link API} splat setup.
     */
    handle({ route, type, request }: handleOptions) {
        // Route does not exist
        if (!route) {
            return redirect("/");
        }

        // Route exists!
        const existingRoute = this.endpoints.get(route);
        const existingType = existingRoute?.[type];

        // Route type does not exist
        if (!existingType) {
            return null;
        }

        // Get the last param from the route
        const splitURL = request.url.split("/");
        const param = splitURL[splitURL.length - 1].replace(/\?.+/, "");

        return existingType.callback({ param, request });
    }
}
