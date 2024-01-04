"use client";

import { useDisclosure } from "@mantine/hooks";
import { Burger, Drawer, Group, Stack } from "@mantine/core";
import { NavigationMenu } from "./NavigationMenu";
import Image from "next/image";

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
                color={isDark ? "white" : "dark"}
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
