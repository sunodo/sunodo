import classes from "./Section.module.css";

type Props = {
    children?: React.ReactNode;
};

export function Section({
    children,
    ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <section className={classes.section} {...rest}>
            {children}
        </section>
    );
}
