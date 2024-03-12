"use client";

import { Container } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { FC, Suspense } from "react";

import DeployComponent from "../../components/Deploy/Deploy";
import { Section } from "../../components/Section/Section";
import { HeliaProvider } from "../../providers/HeliaProvider";

const Deploy: FC = () => {
    const searchParams = useSearchParams();

    // default location and provider can come from URL
    const locationParam = searchParams.get("cid");
    const providerParam = searchParams.get("provider");

    return (
        <DeployComponent
            cid={locationParam ?? ""}
            provider={providerParam ?? ""}
        />
    );
};

const DeployPage: FC = () => {
    return (
        <HeliaProvider>
            <Section size="sm">
                <Container>
                    <Suspense>
                        <Deploy />
                    </Suspense>
                </Container>
            </Section>
        </HeliaProvider>
    );
};

export default DeployPage;
