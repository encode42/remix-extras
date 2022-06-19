// Based on https://github.com/mantinedev/mantine/blob/229bdbe3c124cced704a7a14563f73b8ff7b2b54/src/mantine-styles/src/theme/ColorSchemeProvider.tsx
import React, { createContext, PropsWithChildren, useContext } from "react";
import { GenericUser } from "../../util";

interface UserContextProps<T = unknown> {
    "user": T,
    "logoutRoute": string
}

const UserContext = createContext<UserContextProps>(null);

export function useUser<T extends GenericUser | unknown>() {
    const ctx = useContext(UserContext);

    if (!ctx) {
        throw new Error("useUser hook was called outside of context, make sure your app is wrapped with UserProvider component")
    }

    return ctx as UserContextProps<T>;
}

interface UserProviderProps extends UserContextProps, PropsWithChildren {};

export function UserProvider({ user, logoutRoute, children }: UserProviderProps) {
    return (
        <UserContext.Provider value={{ user, logoutRoute }}>
            {children}
        </UserContext.Provider>
    );
}
