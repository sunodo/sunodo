import classes from "./Section.module.css";

type Props = {
    children?: React.ReactNode;
    size?: "sm" | "md" | "lg";
};

export function Section({
    children,
    size = "lg",
    ...rest
}: Props & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <section className={`${classes.section} ${classes[size]}`} {...rest}>
            {children}
        </section>
    );
}
