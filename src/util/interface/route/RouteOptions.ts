import { Request } from "@remix-run/node";
import { Params } from "react-router";

/**
 * A generic route with the {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest request} field.
 */
export interface RouteRequest {
    "request": Request
}

/**
 * A generic route with the {@link https://reactrouter.com/docs/en/v6/hooks/use-params params} field.
 */
export interface RouteParams {
    "params": Params
}

/**
 * A generic route with the {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest request} and {@link https://reactrouter.com/docs/en/v6/hooks/use-params params} fields.
 */
export interface RouteOptions extends RouteRequest, RouteParams {}
