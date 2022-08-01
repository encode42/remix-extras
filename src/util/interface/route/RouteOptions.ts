import { Request } from "@remix-run/node";
import { Params } from "react-router";

/**
 * A generic route with the [request](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest) field.
 */
export interface RouteRequest {
    "request": Request
}

/**
 * A generic route with the [params](https://reactrouter.com/docs/en/v6/hooks/use-params) field.
 */
export interface RouteParams {
    "params": Params
}

/**
 * A generic route with the [request](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest) and [params](https://reactrouter.com/docs/en/v6/hooks/use-params) fields.
 */
export interface RouteOptions extends RouteRequest, RouteParams {}
