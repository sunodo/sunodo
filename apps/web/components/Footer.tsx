import Link from 'next/link';
import { Anchor, Container, Grid, GridCol, Group, Paper, Stack } from '@mantine/core';
import { Logo } from './Logo';

import { IconBrandX, IconBrandGithub } from '@tabler/icons-react';

export function Footer() {
  const items = [
    {
      label: 'Meet Sunodo',
      href: '/#meet-sunodo',
    },
    {
      label: 'Docs',
      href: 'https://docs.sunodo.io/',
      external: true,
    },
    {
      label: 'Deploy',
      href: '/deploy',
    },
    {
      label: 'Cartesi.io',
      href: 'https://cartesi.io',
      external: true,
    },
  ];

  const social = [
    {
      label: 'GitHub',
      href: 'https://github.com/sunodo',
      external: true,
      icon: <IconBrandGithub />,
    },
    /*{
      label: 'Discord',
      href: '#',
      external: true,
    },*/
    {
      label: 'X',
      href: 'https://twitter.com/SunodoProject',
      external: true,
      icon: <IconBrandX />,
    },
  ];

  return (
    <Paper
      bg="black"
      c="white"
      component="footer"
      radius={0}
      py={{
        base: 'xl',
        sm: '2xl',
      }}
    >
      <Container>
        <Grid>
          <GridCol span={{ base: 12, sm: 4 }}>
            <Logo isDark />
          </GridCol>
          <GridCol span={{ base: 12, sm: 4 }}>
            <Stack>
              {items.map(({ href, label, external }) => (
                <Anchor
                  fz="sm"
                  c="white"
                  component={Link}
                  href={href}
                  key={label}
                  target={external ? '_blank' : ''}
                  rel={external ? 'noopener noreferrer' : ''}
                >
                  {label}
                </Anchor>
              ))}
            </Stack>
          </GridCol>
          <GridCol span={{ base: 12, sm: 4 }}>
            <Group gap={'lg'}>
              {social.map(({ href, label, external, icon }) => (
                <Anchor
                  fz="sm"
                  c="white"
                  component={Link}
                  href={href}
                  key={label}
                  target={external ? '_blank' : ''}
                  rel={external ? 'noopener noreferrer' : ''}
                >
                  {icon}
                </Anchor>
              ))}
            </Group>
          </GridCol>
        </Grid>
      </Container>
    </Paper>
  );
}
