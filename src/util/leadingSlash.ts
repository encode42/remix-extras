/**
 * Manage the leading slash on a string.
 *
 * @param string String to manipulate
 * @param shouldHave Whether the string should have a leading slash
 */
export function leadingSlash(string: string, shouldHave = true) {
    const hasSlash = string.endsWith("/");

    // String should have a slash and does, or should not have a slash and doesn't
    if ((hasSlash && shouldHave) || (!hasSlash && !shouldHave)) {
        return string;
    }

    // String shouldn't have a slash and does
    if (hasSlash && !shouldHave) {
        return string.slice(0, -1);
    }

    // String should have a slash and doesn't
    return `${string}/`;
}

