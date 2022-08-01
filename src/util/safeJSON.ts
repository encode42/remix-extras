/**
 * Safely converts an object to its JSON equivalent.
 *
 * @param value Object to convert
 * @return Either the input object or JSON-parsed equivalent.
 */
export function safeJSON<T>(value: any): T | any {
    let result: T;

    try {
        result = JSON.parse(value);
    } catch {
        return value;
    }

    return result;
}
