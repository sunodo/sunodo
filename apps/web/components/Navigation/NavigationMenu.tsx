import { Button } from "@mantine/core";
import Link from "next/link";

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
                variant="filled"
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
                c={isDark ? "white" : "black"}
                target={external ? "_blank" : ""}
                rel={external ? "noopener noreferrer" : ""}
            >
                {label}
            </Button>
        ),
    );
}
