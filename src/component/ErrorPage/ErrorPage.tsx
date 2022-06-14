import React from "react";
import { ErrorPage as MantineErrorPage, ErrorPageProps } from "@encode42/mantine-extras";
import { Anchor } from "../Anchor";
import { useNavigate } from "react-router";

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
                    navigate("..");
                }}>
                    Back
                </Anchor>
            </>
        } />
    );
}
