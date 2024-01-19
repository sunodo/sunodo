import { Button } from "@mantine/core";
import cx from "clsx";
import Link from "next/link";
import classes from "./NavigationMenu.module.css";

type Props = {
    isDark?: boolean;
};

export function NavigationMenu({ isDark }: Props) {
    const items = [
        {
            label: "Meet Sunodo",
            href: "/#meet-sunodo",
        },
        {
            label: "Docs",
            href: "https://docs.sunodo.io/",
            external: true,
        },
        {
            label: "Deploy",
            href: "/deploy",
            isCta: true,
        },
    ];

    return items.map(({ href, label, isCta, external }) =>
        isCta ? (
            <Button
                key={label}
                component={Link}
                href={href}
                variant="secondary"
                c={isDark ? "gray.9" : ""}
                bg={isDark ? "white" : ""}
                ml={{
                    base: 0,
                    sm: "xl",
                }}
                target={external ? "_blank" : ""}
                rel={external ? "noopener noreferrer" : ""}
            >
                {label}
            </Button>
        ) : (
            <Button
                key={label}
                component={Link}
                href={href}
                variant="transparent"
                className={cx(isDark ? classes.dark : classes.light)}
                target={external ? "_blank" : ""}
                rel={external ? "noopener noreferrer" : ""}
            >
                {label}
            </Button>
        ),
    );
}
