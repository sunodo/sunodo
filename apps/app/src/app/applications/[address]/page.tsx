"use client";
import { FC } from "react";
import Address from "../../../components/address";
import { Anchor, Breadcrumbs, Stack } from "@mantine/core";

export type ApplicationPageProps = {
    params: { address: string };
};
const ApplicationPage: FC<ApplicationPageProps> = ({ params }) => {
    return (
        <Stack>
            <Breadcrumbs>
                <Anchor>Home</Anchor>
                <Anchor>Applications</Anchor>
                <Address value={params.address as Address} icon />
            </Breadcrumbs>
            <Address value={params.address as Address} />
        </Stack>
    );
};

export default ApplicationPage;
