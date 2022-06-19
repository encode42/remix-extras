import { SessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { storageBuilder } from "../session";

/**
 * Options for the {@link authBuilder} function.
 */
export interface authBuilderProps {
    /**
     * {@link https://remix.run/docs/en/v1/api/remix#sessions SessionStorage} object to authenticate with.
     *
     * @see storageBuilder
     */
    "sessionStorage"?: SessionStorage
}

/**
 * Function to build an {@link https://github.com/sergiodxa/remix-auth/blob/main/docs/authenticator.md Authenticator} object.
 */
export function authBuilder<T>({ sessionStorage = storageBuilder({}) }: authBuilderProps) {
    return new Authenticator<T>(sessionStorage, {
        "sessionKey": "_auth"
    });
}
