import { Request } from "@remix-run/node";
import { Params } from "react-router";

export interface RouteOptions extends RouteRequest, RouteParams {}

export interface RouteRequest {
    "request": Request
}

export interface RouteParams {
    "params": Params
}
