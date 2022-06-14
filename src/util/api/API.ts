import { Params } from "react-router";
import { Request, Response } from "@remix-run/node";

export interface EndpointParams {
    "params": Params,
    "request": Request
}

export type EndpointCallback<T> = ({ params, request }: EndpointParams) => T;
export type EndpointType = "action" | "loader" | "default";

/**
 * Options for the {@link API} class.
 */
export interface APIProps {
    /**
     * URL of the website.
     *
     * Defaults to {@code process.env.WEBSITE_URL} or {@code https://localhost:3000}.
     */
    "websiteURL"?: string,

    /**
     * Version of the API to use.
     */
    "apiVersion"?: number,

    /**
     * Format of the endpoint.
     *
     * Uses {@code ${websiteURL}/api/v${apiVersion}/} by default.
     */
    "endpointFormat"?: string
}

export interface registerOptions<T> {
    "route": string,
    "type": EndpointType,
    callback: EndpointCallback<T>
}

export interface handleOptions {
    "route"?: string,
    "type": EndpointType,
    "request"?: Request,
    "params"?: Params
}

export type EndpointActions<T> = {
    [key in EndpointType]: {
        "callback": EndpointCallback<T>
    }
}

/**
 * An API convenience class.
 *
 * Routes are expected to be stored in {@code ${websiteURL}/api/v${apiVersion}/} by default.
 */
export class API {
    private readonly websiteURL: string;
    private readonly apiVersion: number;
    private readonly endpointFormat: string;

    private readonly endpoints = new Map<string, EndpointActions<unknown>>;

    constructor({ websiteURL = process.env.WEBSITE_URL ?? "https://localhost:3000", apiVersion = 1, endpointFormat }: APIProps) {
        this.websiteURL = websiteURL;
        this.apiVersion = apiVersion;

        this.endpointFormat = endpointFormat ?? `${websiteURL}/api/v${apiVersion}/`;
    }

    /**
     * Format an array of paths into an API path.
     */
    format(...paths) {
        return `${this.endpointFormat}/${paths.join("/")}`;
    }

    register<T = Response>({ route, type, callback }: registerOptions<T>) {
        let endpoint = {
            [type]: {
                callback
            }
        } as EndpointActions<T>;

        const existingRoute = this.endpoints.get(route);
        if (existingRoute) {
            endpoint = {
                ...existingRoute,
                ...endpoint
            };
        }

        this.endpoints.set(route, endpoint);
    }

    handle({ route, type, request, params }: handleOptions) {
        if (!route) {
            return null;
        }

        const existingRoute = this.endpoints.get(route);
        const existingType = existingRoute?.[type];
        if (!existingType) {
            return null;
        }

        return existingType.callback({ params, request });
    }
}
