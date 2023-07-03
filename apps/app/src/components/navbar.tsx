import { FC, useState } from "react";
import Link from "next/link";
import { Navbar as MantineNavbar, Text } from "@mantine/core";
import { TbRocket } from "react-icons/tb";

const Navbar: FC = () => {
    const [opened, setOpened] = useState(false);
    const data = [{ link: "/deploy", label: "Deploy", icon: TbRocket }];

    const links = data.map((item) => (
        <Link href={item.link} key={item.label}>
            <item.icon />
            <span>{item.label}</span>
        </Link>
    ));
    return (
        <MantineNavbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
        >
            <MantineNavbar.Section>{links}</MantineNavbar.Section>
        </MantineNavbar>
    );
};

export default Navbar;
