import { createCookieSessionStorage, createSessionStorage, SessionData, SessionIdStorageStrategy } from "@remix-run/node";
import { getEnv } from "../getEnv";

/**
 * Represents a method used to create entries in the database.
 */
export type CreateMethod = (data: SessionData, expires?: Date) => Promise<string>;

/**
 * Represents a method used to read entries from the database.
 */
export type ReadMethod = (id: string) => Promise<SessionData | null>;

/**
 * Represents a method used to update entries in the database.
 */
export type UpdateMethod = (id: string, data: SessionData, expires?: Date) => Promise<void>;

/**
 * Represents a method used to delete entries from the database.
 */
export type RemoveMethod = (id: string) => Promise<void>;

/**
 * Generates a {@link Cookie} object from the provided options.
 */
interface generateCookieProps {
    /**
     * Name of the session storage.
     *
     * @defaultValue _session
     */
    "name"?: string,

    /**
     * Secret for the stored cookies.
     *
     * @defaultValue process.env.COOKIE_AUTH_SECRET
     */
    "secret"?: string
}

/**
 * Options for the {@link storageBuilder}'s `cookie` function.
 */
export interface cookieBuilderProps extends generateCookieProps {}

/**
 * Options for the {@link storageBuilder}'s `database` function.
 */
export interface databaseBuilderProps extends generateCookieProps {
    /**
     * Method used to create entries in the database.
     */
    "create": CreateMethod,

    /**
     * Method used to read entries from the database.
     */
    "read": ReadMethod,

    /**
     * Method used to update entries in the database.
     */
    "update": UpdateMethod,

    /**
     * Method used to remove entries from the database.
     */
    "remove": RemoveMethod
}

/**
 * Generates a cookie object.
 */
function generateCookie({ name = "_session", secret = getEnv("COOKIE_AUTH_SECRET") }: generateCookieProps): SessionIdStorageStrategy["cookie"] {
    if (!secret) {
        throw new Error("'secret' must not be undefined.");
    }

    return {
        "name": name,
        "sameSite": "lax",
        "path": "/",
        "httpOnly": true,
        "secrets": [secret],
        "secure": process.env.NODE_ENV === "production"
    };
}

/**
 * Build a cookie-based session storage.
 */
function cookieBuilder({ name, secret }: cookieBuilderProps) {
    return createCookieSessionStorage({
        "cookie": generateCookie({ name, secret })
    });
}

/**
 * Build a database-based session storage.
 */
function databaseBuilder({ create, read, update, remove, name, secret }: databaseBuilderProps) {
    return createSessionStorage({
        "cookie": generateCookie({ name, secret }),
        "createData": create,
        "readData": read,
        "updateData": update,
        "deleteData": remove
    });
}

/**
 * Builders for a [SessionStorage](https://remix.run/docs/en/v1/api/remix#sessions) object.
 */
export const storageBuilder = {
    /**
     * Build a cookie-based session storage.
     */
    "cookie": cookieBuilder,

    /**
     * Build a database-based session storage.
     */
    "database": databaseBuilder
};
