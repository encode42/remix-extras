import { createCookieSessionStorage } from "@remix-run/node";

/**
 * Options for the {@link storageBuilder} function.
 */
export interface storageBuilderProps {
    /**
     * Name of the session storage.
     */
    "name"?: string;

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
export function storageBuilder({ name = "_session", secret = process.env.COOKIE_AUTH_SECRET }: storageBuilderProps) {
    return createCookieSessionStorage({
        "cookie": {
            "name": name,
            "sameSite": "lax",
            "path": "/",
            "httpOnly": true,
            "secrets": secret ? [secret] : undefined,
            "secure": process.env.NODE_ENV === "production"
        }
    });
}
