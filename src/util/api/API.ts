/**
 * Options for the {@link API} class.
 */
export interface APIProps {
    /**
     * URL of the website.
     */
    "websiteURL": string,

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

/**
 * An API convenience class.
 *
 * Routes are expected to be stored in {@code ${websiteURL}/api/v${apiVersion}/} by default.
 */
export class API {
    private readonly websiteURL: string;
    private readonly apiVersion: number;
    private readonly endpointFormat: string;

    constructor({ websiteURL, apiVersion = 1, endpointFormat }: APIProps) {
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
}
