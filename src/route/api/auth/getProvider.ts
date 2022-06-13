import { redirect } from "@remix-run/node";
import { Auth } from "../../../util";

/**
 * Get a dynamic auth provider route.
 * @param auth {@link Auth} instance to authenticate with.
 * @param param Parameter name.
 *
 * Defaults to {@code provider}, for use with {@code $provider.ts}.
 */
export function getProvider(auth: Auth, param = "provider") {
    return {
        "loader": () => {
            return redirect("/");
        },
        "action": ({ request, params }) => {
            return auth.auth(request, params[param]);
        },
    };
}
