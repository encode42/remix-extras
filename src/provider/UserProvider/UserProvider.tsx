// Based on https://github.com/mantinedev/mantine/blob/229bdbe3c124cced704a7a14563f73b8ff7b2b54/src/mantine-styles/src/theme/ColorSchemeProvider.tsx
import React, { createContext, PropsWithChildren, useContext } from "react";

/**
 * Options for the UserContext context and {@link UserProvider} provider.
 */
export interface UserContextProps<T = unknown> {
    /**
     * Logged in user.
     */
    "user": T,

    /**
     * Route used for logging out.
     */
    "logoutRoute": string
}

/**
 * React context.
 */
const UserContext = createContext<UserContextProps>(null);

/**
 * Use the logged-in user hook.
 */
export function useUser<T = unknown>() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser hook was called outside of context, make sure your app is wrapped with UserProvider component");
    }

    return ctx as UserContextProps<T>;
}

/**
 * Options for the {@link UserProvider} component.
 */
export interface UserProviderProps extends UserContextProps, PropsWithChildren {}

/**
 * Provider for the currently logged-in user.
 */
export function UserProvider({ user, logoutRoute, children }: UserProviderProps) {
    return (
        <UserContext.Provider value={{ user, logoutRoute }}>
            {children}
        </UserContext.Provider>
    );
}
