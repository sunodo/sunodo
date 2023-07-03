import { FC } from "react";
import { Footer as MantineFooter } from "@mantine/core";

const Footer: FC = () => {
    return (
        <MantineFooter height={60} p="md">
            Copyright © 2023
        </MantineFooter>
    );
};

export default Footer;
