"use client";
import Image from "next/image";
import Terminal from "@nitric/react-animated-term";
import "@nitric/react-animated-term/css/styles.css";

const termLines = [
    {
        text: "brew install sunodo/tap/sunodo",
        cmd: true,
    },
    {
        text: "sunodo create <app> --template [javascript | python]",
        cmd: true,
    },
    {
        text: "cd <app>",
        cmd: true,
    },
    {
        text: "sunodo build",
        cmd: true,
    },
    {
        text: "sunodo shell",
        cmd: true,
    },
];

export default function Page() {
    return (
        <>
            <Terminal lines={termLines} interval={40} replay={false} />
        </>
    );
}
