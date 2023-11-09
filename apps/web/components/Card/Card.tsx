import { Divider, Paper, PaperProps } from '@mantine/core';
import classes from './Card.module.css';

type Props = {
  children?: React.ReactNode;
  withBorder?: boolean;
  isDark?: boolean;
};

const padding = {
  base: 'xl',
  sm: '2xl',
};

const CardSeparator = () => <Divider my={padding} className={classes.divider} />;

export function Card({ children, withBorder, isDark, ...rest }: Props & PaperProps) {
  const { bg, c, className, ...other } = rest;

  return (
    <Paper
      radius="xl"
      p={padding}
      bg={isDark ? 'black' : bg}
      c={isDark ? 'gray.0' : c}
      className={withBorder ? classes.border : className}
      {...other}
    >
      {children}
    </Paper>
  );
}

Card.Separator = CardSeparator;
