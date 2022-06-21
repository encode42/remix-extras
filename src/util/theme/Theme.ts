import { APIProp, RouteRequest } from "../interface";
import { API } from "../api";
import { json, Request, SessionStorage } from "@remix-run/node";
import { storageBuilder } from "../session";
import { getFormData } from "remix-params-helper";
import { SetTheme } from "../../validation";
import { ColorScheme } from "@mantine/core";

/**
 * Options for the {@link Theme} class.
 */
export interface ThemeProps extends APIProp {
    /**
     * Default {@link https://mantine.dev/hooks/use-color-scheme ColorScheme} of the website.
     */
    "colorScheme"?: ColorScheme
}

/**
 * Result of the {@link get} function.
 */
export interface getResult {
    /**
     * Request's color scheme.
     */
    "colorScheme": ColorScheme
}

/**
 * A class to handle user theming via cookies.
 */
export class Theme {
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
     * Default {@link https://mantine.dev/hooks/use-color-scheme ColorScheme} of the website.
     */
    public readonly colorScheme: ColorScheme;

    /**
     * The route to set a user's theme.
     */
    public readonly setRoute: string;

    constructor({ api, colorScheme = "dark" }: ThemeProps) {
        this.sessionStorage = storageBuilder({
            "name": "_theme"
        });

        this.api = api;
        this.colorScheme = colorScheme;

        // Register the set route
        this.setRoute = this.api.format(false, "theme", "set");
        this.api.register({
            "route": this.setRoute,
            "type": "action",
            "callback": async ({ request }: RouteRequest) => {
                const formValidation = await getFormData(request, SetTheme);
                if (!formValidation.data) {
                    return json({
                        "errors": formValidation.errors
                    }, {
                        "status": 400
                    });
                }

                // Set the colorScheme variable
                const cookie = await this.getCookie(request);
                cookie.flash("colorScheme", formValidation.data.colorScheme);

                // Reply with the cookie header
                return json(null, {
                    "headers": {
                        "Set-Cookie": await this.sessionStorage.commitSession(cookie)
                    }
                });
            }
        });
    }

    /**
     * Get the session cookie from a request.
     *
     * @param request Request to get cookie from.
     */
    private async getCookie(request: Request) {
        return await this.sessionStorage.getSession(request.headers.get("Cookie"));
    }

    /**
     * Get the request's theme.
     *
     * @param request Request to get theme from.
     */
    public async get(request: Request): Promise<getResult> {
        const cookie = await this.getCookie(request);

        return {
            "colorScheme": cookie.get("colorScheme") ?? this.colorScheme
        };
    }
}
