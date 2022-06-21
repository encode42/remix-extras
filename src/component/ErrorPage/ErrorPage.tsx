import React from "react";
import { useNavigate } from "@remix-run/react";
import { ErrorPage as MantineErrorPage, ErrorPageProps } from "@encode42/mantine-extras";
import { Anchor } from "../Anchor";

/**
 * A generic error page with back button.
 */
export function ErrorPage({
    statusCode,
    title
}: ErrorPageProps) {
    const navigate = useNavigate();

    return (
        <MantineErrorPage statusCode={statusCode} title={title} links={
            <>
                <Anchor to="/">
                    Home
                </Anchor>
                <Anchor onClick={() => {
                    navigate(-1);
                }}>
                    Back
                </Anchor>
            </>
        } />
    );
}
