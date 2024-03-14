"use client";
import "@mantine/code-highlight/styles.css";

import { Container } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { FC, Suspense } from "react";

import DeployComponent from "../../components/Deploy/Deploy";
import { Section } from "../../components/Section/Section";

const Deploy: FC = () => {
    const searchParams = useSearchParams();

    // default location and provider can come from URL
    const locationParam = searchParams.get("cid");
    const providerParam = searchParams.get("provider");

    // templateHash comes in case of self-hosted
    const templateHashParam = searchParams.get("templateHash");

    return (
        <DeployComponent
            cid={locationParam ?? ""}
            provider={providerParam ?? ""}
            templateHash={templateHashParam ?? ""}
        />
    );
};

const DeployPage: FC = () => {
    return (
        <Section size="sm">
            <Container>
                <Suspense>
                    <Deploy />
                </Suspense>
            </Container>
        </Section>
    );
};

export default DeployPage;
