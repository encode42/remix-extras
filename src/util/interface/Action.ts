import { Request } from "@remix-run/node";

/**
 * A generic {@code action} function interface.
 */
export interface Action {
    "request": Request
}
