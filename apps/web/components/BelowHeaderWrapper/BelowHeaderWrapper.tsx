import classes from "./BelowHeaderWrapper.module.css";

type Props = {
    children: React.ReactNode;
};

export function BelowHeaderWrapper({ children }: Props) {
    return <div className={classes.wrapper}>{children}</div>;
}
