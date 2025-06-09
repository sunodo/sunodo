"use client";
import "@mantine/code-highlight/styles.css";

import { Container } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { Suspense } from "react";

import DeployComponent from "../../components/Deploy/Deploy";
import { Section } from "../../components/Section/Section";

const DEFAULT_VERSION = "v2";

const Deploy: FC = () => {
    const searchParams = useSearchParams();

    // default location, provider and version can come from URL
    const locationParam = searchParams.get("cid");
    const providerParam = searchParams.get("provider");
    const versionParam = searchParams.get("version") as "v1" | "v2" | undefined;

    // templateHash comes in case of self-hosted
    const templateHashParam = searchParams.get("templateHash");

    return (
        <DeployComponent
            cid={locationParam ?? ""}
            provider={providerParam ?? ""}
            templateHash={templateHashParam ?? ""}
            version={versionParam ?? DEFAULT_VERSION}
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
