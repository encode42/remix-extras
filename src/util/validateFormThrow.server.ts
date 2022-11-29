import { validateForm } from "@encode42/node-extras";
import { json } from "@remix-run/node";
import { ZodType } from "zod";

/**
 * Validate a request's [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) with a [Zod](https://github.com/colinhacks/zod) schema.
 *
 * @remarks
 * [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object passed into this function should have a `data` field which is stringified.
 *
 * @param request Request to validate
 * @param schema  [Zod](https://github.com/colinhacks/zod) schema to validate with
 * @return Either the validated [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) or empty object
 * @throws JSON response containing errors
 */
export async function validateFormThrow(request: Request, schema: ZodType) {
    const validation = await validateForm(request, schema, true);

    if (!validation.success && "error" in validation) {
        throw json({
            "error": validation.error
        }, {
            "status": 400
        });
    }

    return validation.data;
}
