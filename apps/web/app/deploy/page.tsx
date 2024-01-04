"use client";

import { Container } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { FC } from "react";

import Deploy from "../../components/Deploy/Deploy";
import { Section } from "../../components/Section/Section";

const DeployPage: FC = () => {
    // default location and hash can come from URL
    const searchParams = useSearchParams();
    const locationParam = searchParams.get("cid");

    return (
        <Section>
            <Container>
                <Deploy cid={locationParam ?? ""} />
            </Container>
        </Section>
    );
};

export default DeployPage;
