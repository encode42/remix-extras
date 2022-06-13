import React from "react";
import { Error } from "@encode42/mantine-extras";
import { Anchor } from "../Anchor";
import { useNavigate } from "react-router";

export function ErrorPage({
    statusCode,
    title,
    links
}) {
    const navigate = useNavigate();

    return (
        <Error statusCode={statusCode} title={title} links={
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
    )
}
