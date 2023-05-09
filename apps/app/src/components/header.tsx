"use client";
import { FC } from "react";
import {
    Group,
    Header as MantineHeader,
    Switch,
    Title,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { TbMoonStars, TbSun } from "react-icons/tb";

const Header: FC = () => {
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <MantineHeader height={60}>
            <Group sx={{ height: "100%" }} px={20} position="apart">
                <Title>Sunodo</Title>
                <Switch
                    checked={colorScheme === "dark"}
                    onChange={() => toggleColorScheme()}
                    size="md"
                    onLabel={<TbSun color={theme.white} size="1rem" />}
                    offLabel={
                        <TbMoonStars color={theme.colors.gray[6]} size="1rem" />
                    }
                />
            </Group>
        </MantineHeader>
    );
};

export default Header;
