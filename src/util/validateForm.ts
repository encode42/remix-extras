import { ZodType } from "zod";
import { safeJSON } from "./safeJSON";

/**
 * Validate a request's [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) with a [Zod](https://github.com/colinhacks/zod) schema.
 *
 * @remarks
 * [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object passed into this function should have a `data` field which is stringified.
 *
 * @param request Request to validate
 * @param schema  [Zod](https://github.com/colinhacks/zod) schema to validate with
 * @return Either the validated [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) or empty object
 * @example
 * > `/app/routes/index.tsx`
 * ```ts
 * import { useSubmit } from "@remix-run/react";
 * import { json } from "@remix-run/node";
 * import { RouteRequest, validateForm } from "@encode42/remix-extras";
 * import { Button } from "@mantine/core";
 * import { z } from "zod";
 *
 * const IndexSubmission = z.object({
 *     "id": z.number().min(0).max(65535)
 * });
 *
 * export async function action({ request }: RouteRequest) {
 *     const validation = await validateForm(request, IndexSubmission);
 *     if (!validation.success) {
 *         return json({
 *             "errors": validation.errors
 *         }, {
 *             "status": 400
 *         });
 *     }
 *
 *     console.log(validation.data.id);
 * }
 *
 * export default function IndexPage() {
 *     const submit = useSubmit();
 *
 *     return (
 *         <Button onClick={() => {
 *             submit({
 *                 "data": JSON.stringify({
 *                     "id": Math.floor(Math.random() * 65536)
 *                 } as z.infer<typeof IndexSubmission>)
 *             }, {
 *                 "method": "post"
 *             });
 *         }}>
 *             Send request
 *         </Button>
 *     );
 * }
 * ```
 */
export async function validateForm<T extends ZodType>(request: Request, schema: T) {
    const formData = await request.formData();
    const data = formData.get("data") ?? "";

    return schema.safeParse(safeJSON<T>(data));
}
