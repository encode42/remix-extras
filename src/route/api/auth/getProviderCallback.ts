import { Auth } from "../../../util";

/**
 * Get a dynamic auth provider callback route.
 * @param auth {@link Auth} instance to authenticate with.
 * @param param Parameter name.
 *
 * Defaults to {@code provider}, for use with {@code $provider.callback.ts}.
 */
export function getProviderCallback(auth: Auth, param = "provider") {
    return {
        "loader": ({ request, params }) => {
            return auth.auth(request, params[param]);
        }
    };
}
