/**
 * Get the name of a variable.
 *
 * @author https://stackoverflow.com/a/66935761/10015929
 * @param variable Variable wrapped in a function.
 */
function getName(variable: () => any) {
    return variable.toString().replace(/[ ()=>|]/g,"");
}

/**
 * Get the name of a variable.
 *
 * @remarks
 * Handles the passing of arrays.
 *
 * @author https://stackoverflow.com/a/66935761/10015929
 * @param variable Variable wrapped in a function.
 * @example
 * ```ts
 * const message = "Hello World!";
 *
 * const name = variableName(() => message);
 *
 * console.log(name); // "message"
 * ```
 */
export function variableName(variable: () => any) {
    const result = variable();
    const name = getName(variable);

    if (Array.isArray(result)) {
        return name.replace(/^\[|]$/g, "").split(",");
    }

    return name;
}
