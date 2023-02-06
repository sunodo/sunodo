"use client";
import Image from "next/image";
import Terminal from "@nitric/react-animated-term";
import "@nitric/react-animated-term/css/styles.css";

const termLines = [
    {
        text: "brew install sunodo",
        cmd: true,
        delay: 80,
    },
    {
        text: "sunodo auth login",
        cmd: true,
    },
    {
        text: "sunodo app create --name my-app",
        cmd: true,
    },
    {
        text: "sunodo deploy --app my-app --chain goerli",
        cmd: true,
    },
];

export default function Page() {
    return (
        <>
            <center>
                <Image alt="logo" src="img/logo.svg" width={100} height={100} />
            </center>
            <Terminal lines={termLines} interval={80} replay={false} />
        </>
    );
}
