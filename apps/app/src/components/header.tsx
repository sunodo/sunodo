"use client";
import { FC } from "react";
import {
    Flex,
    Switch,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { TbMoonStars, TbSun } from "react-icons/tb";

const Header: FC = () => {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Flex justify="flex-end" align="center" h="100%" p={20}>
            <Switch
                checked={colorScheme === "dark"}
                onChange={() => toggleColorScheme()}
                size="md"
                onLabel={<TbSun color={theme.white} size="1rem" />}
                offLabel={
                    <TbMoonStars color={theme.colors.gray[6]} size="1rem" />
                }
            />
        </Flex>
    );
};

export default Header;
