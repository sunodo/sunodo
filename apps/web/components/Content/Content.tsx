import classes from './Content.module.css';

type Props = {
  children: React.ReactNode;
};

export function Content({ children }: Props) {
  return <div className={classes.wrapper}>{children}</div>;
}
