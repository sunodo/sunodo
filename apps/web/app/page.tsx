import { Metadata } from "next";

import { CtaGetStarted } from "../components/Homepage/CtaGetStarted";
import { Discover } from "../components/Homepage/Discover/Discover";
import { Features } from "../components/Homepage/Features";
import { Gaming } from "../components/Homepage/Gaming";
import { Hero } from "../components/Homepage/Hero/Hero";
import { Welcome } from "../components/Homepage/Welcome";

export const metadata: Metadata = {
    title: "Sunodo - Deploy verifiable Linux VMs with a click of a button",
    description:
        "Build and test fully managed Cartesi Rollups on a modular stack.",
};

export default function HomePage() {
    return (
        <>
            <Hero />
            <Welcome />
            <Features />
            <Discover />
            <Gaming />
            <CtaGetStarted />
        </>
    );
}
