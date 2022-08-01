import { SessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";

/**
 * Options for the {@link authBuilder} function.
 */
export interface authBuilderProps {
    /**
     * [SessionStorage](https://remix.run/docs/en/v1/api/remix#sessions) object to authenticate with.
     *
     * @see storageBuilder
     */
    "storage": SessionStorage
}

/**
 * Function to build an [Authenticator](https://github.com/sergiodxa/remix-auth/blob/main/docs/authenticator.md) object.
 */
export function authBuilder<T>({ storage }: authBuilderProps) {
    return new Authenticator<T>(storage, {
        "sessionKey": "_auth"
    });
}
