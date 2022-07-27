import { SessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";

/**
 * Options for the {@link authBuilder} function.
 */
export interface authBuilderProps {
    /**
     * {@link https://remix.run/docs/en/v1/api/remix#sessions SessionStorage} object to authenticate with.
     *
     * @see storageBuilder
     */
    "storage": SessionStorage
}

/**
 * Function to build an {@link https://github.com/sergiodxa/remix-auth/blob/main/docs/authenticator.md Authenticator} object.
 */
export function authBuilder<T>({ storage }: authBuilderProps) {
    return new Authenticator<T>(storage, {
        "sessionKey": "_auth"
    });
}
