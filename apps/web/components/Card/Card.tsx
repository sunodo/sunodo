import { Divider, Paper, PaperProps } from "@mantine/core";
import cx from "clsx";
import classes from "./Card.module.css";
type Props = {
    children?: React.ReactNode;
    withBorder?: boolean;
    isDark?: boolean;
    filled?: boolean;
};

const padding = {
    base: "xl",
    sm: "2xl",
};

const CardSeparator = () => (
    <Divider my={padding} className={classes.divider} />
);

export function Card({
    children,
    withBorder,
    isDark,
    filled,
    ...rest
}: Props & PaperProps) {
    const { className, ...other } = rest;

    return (
        <Paper
            radius="xl"
            p={padding}
            className={cx(
                filled && isDark && classes.dark,
                filled && !isDark && classes.light,
                withBorder && classes.border,
                className,
            )}
            {...other}
        >
            {children}
        </Paper>
    );
}

Card.Separator = CardSeparator;
