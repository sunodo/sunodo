"use client";

import { Burger, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import cx from "clsx";
import Image from "next/image";
import { NavigationMenu } from "../NavigationMenu/NavigationMenu";
import classes from "./Navigation.module.css";
type Props = {
    isDark?: boolean;
};

export function Navigation({ isDark }: Props) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Group wrap="nowrap" visibleFrom="sm" gap="0" align="center">
                <NavigationMenu isDark={isDark} />
            </Group>
            <Burger
                opened={opened}
                hiddenFrom="sm"
                onClick={open}
                aria-label="Toggle navigation"
                className={cx(isDark ? classes.dark : classes.light)}
            />
            <Drawer opened={opened} onClose={close}>
                <Stack>
                    <Group py="xl" justify="center">
                        <Image
                            src="/logo-icon.svg"
                            alt="Sunodo"
                            width="72"
                            height="72"
                        />
                    </Group>
                    <NavigationMenu />
                </Stack>
            </Drawer>
        </>
    );
}
