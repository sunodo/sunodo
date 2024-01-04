"use client";

import { Container, Flex } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import Link from "next/link";
import { Logo } from "../Logo";
import { Navigation } from "../Navigation/Navigation";
import classes from "./Header.module.css";

export function Header() {
    const [scroll] = useWindowScroll();
    const path = usePathname();
    const pathsWithDarkHeader = ["/"];

    const isDarkHeader = useMemo(
        () => pathsWithDarkHeader.includes(path) && scroll.y === 0,
        [path, scroll.y],
    );

    return (
        <header
            className={`${classes.wrapper} ${
                scroll.y > 0 ? classes.scrolled : ""
            }`}
        >
            <Container>
                <Flex justify="space-between">
                    <Link href="/">
                        <Logo isDark={isDarkHeader} />
                    </Link>
                    <Navigation isDark={isDarkHeader} />
                </Flex>
            </Container>
        </header>
    );
}
