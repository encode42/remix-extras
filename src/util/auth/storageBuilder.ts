import { createCookieSessionStorage } from "@remix-run/node";

/**
 * Options for the {@link storageBuilder} function.
 */
export interface storageBuilderProps {
    /**
     * Secret for the stored cookies.
     *
     * Defaults to the {@code COOKIE_AUTH_SECRET} environment variable.
     */
    "secret"?: string
}

/**
 * Function to build a {@link https://remix.run/docs/en/v1/api/remix#sessions SessionStorage} object.
 */
export function storageBuilder({ secret = process.env.COOKIE_AUTH_SECRET }: storageBuilderProps) {
    if (!secret) {
        throw new Error("The secrets argument or COOKIE_AUTH_SECRET environment variable must not be empty.");
    }

    return createCookieSessionStorage({
        "cookie": {
            "name": "_session",
            "sameSite": "lax",
            "path": "/",
            "httpOnly": true,
            "secrets": [secret],
            "secure": process.env.NODE_ENV === "production"
        }
    });
}
