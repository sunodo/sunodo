"use client";

import {
    ActionIcon,
    Anchor,
    Autocomplete,
    Badge,
    Breadcrumbs,
    Button,
    Checkbox,
    Chip,
    CloseButton,
    Container,
    Divider,
    Fieldset,
    FileInput,
    Group,
    Input,
    Loader,
    MultiSelect,
    NativeSelect,
    NavLink,
    Notification,
    Pagination,
    Paper,
    PasswordInput,
    Pill,
    Progress,
    Radio,
    Rating,
    SegmentedControl,
    Select,
    Slider,
    Stack,
    Stepper,
    Switch,
    Tabs,
    Text,
    TextInput,
    Textarea,
    Title,
    Tooltip,
    rem,
} from "@mantine/core";
import {
    IconActivity,
    IconChevronRight,
    IconCircleOff,
    IconGauge,
    IconHome2,
    IconPlus,
    IconX,
} from "@tabler/icons-react";
import { Section } from "../../components/Section/Section";

export default function Theme() {
    return (
        <Section>
            <Container>
                <Title order={3} mb="xl">
                    Typography
                </Title>
                <Divider my="xl" />
                <Stack gap="lg">
                    <Title order={1}>Heading 1</Title>
                    <Title order={2}>Heading 2</Title>
                    <Title order={3}>Heading 3</Title>
                    <Title order={4}>Heading 4</Title>
                    <Title order={5}>Heading 5</Title>
                    <Title order={6}>Heading 6</Title>

                    <Text size="lg">
                        Text lg. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Suspendisse accumsan justo vitae felis
                        lobortis, eget tempor massa pretium. Donec convallis
                        fermentum semper. Phasellus viverra luctus tellus eu
                        interdum.
                    </Text>
                    <Text size="md">
                        Text md. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Suspendisse accumsan justo vitae felis
                        lobortis, eget tempor massa pretium. Donec convallis
                        fermentum semper. Phasellus viverra luctus tellus eu
                        interdum.
                    </Text>
                    <Text size="sm">
                        Text sm. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Suspendisse accumsan justo vitae felis
                        lobortis, eget tempor massa pretium. Donec convallis
                        fermentum semper. Phasellus viverra luctus tellus eu
                        interdum.
                    </Text>
                    <Text size="xs">
                        Text xs. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Suspendisse accumsan justo vitae felis
                        lobortis, eget tempor massa pretium. Donec convallis
                        fermentum semper. Phasellus viverra luctus tellus eu
                        interdum.
                    </Text>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Colors
                </Title>
                <Divider my="xl" />
                <Stack gap="lg">
                    <Group gap="xs">
                        <Paper bg="brand.0" p="md"></Paper>
                        <Paper bg="brand.1" p="md"></Paper>
                        <Paper bg="brand.2" p="md"></Paper>
                        <Paper bg="brand.3" p="md"></Paper>
                        <Paper bg="brand.4" p="md"></Paper>
                        <Paper bg="brand.5" p="md"></Paper>
                        <Paper bg="brand.6" p="md"></Paper>
                        <Paper bg="brand.7" p="md"></Paper>
                        <Paper bg="brand.8" p="md"></Paper>
                        <Paper bg="brand.9" p="md"></Paper>
                    </Group>
                    <Group gap="xs">
                        <Paper bg="dark.0" p="md"></Paper>
                        <Paper bg="dark.1" p="md"></Paper>
                        <Paper bg="dark.2" p="md"></Paper>
                        <Paper bg="dark.3" p="md"></Paper>
                        <Paper bg="dark.4" p="md"></Paper>
                        <Paper bg="dark.5" p="md"></Paper>
                        <Paper bg="dark.6" p="md"></Paper>
                        <Paper bg="dark.7" p="md"></Paper>
                        <Paper bg="dark.8" p="md"></Paper>
                        <Paper bg="dark.9" p="md"></Paper>
                    </Group>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Button, ActionIcon, CloseButton
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Group gap="lg">
                        <Button>Button</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="light">Light</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="filled">Filled</Button>
                        <Button variant="default">Default</Button>
                        <Button variant="subtle">Subtle</Button>
                        <Button variant="transparent">Transparent</Button>
                    </Group>
                    <Group gap="lg">
                        <Button color="dark">Button</Button>
                        <Button color="dark" variant="secondary">
                            Secondary
                        </Button>
                        <Button color="dark" variant="light">
                            Light
                        </Button>
                        <Button color="dark" variant="outline">
                            Outline
                        </Button>
                        <Button color="dark" variant="filled">
                            Filled
                        </Button>
                        <Button color="dark" variant="default">
                            Default
                        </Button>
                        <Button color="dark" variant="subtle">
                            Subtle
                        </Button>
                        <Button color="dark" variant="transparent">
                            Transparent
                        </Button>
                    </Group>
                    <Divider my="xl" />
                    <Group gap="lg">
                        <Button size="xs">Button xs</Button>
                        <Button size="sm">Button sm</Button>
                        <Button size="md">Button md</Button>
                        <Button size="lg">Button lg</Button>
                        <Button size="xl">Button xl</Button>
                    </Group>

                    <Divider my="xl" />
                    <Group gap="lg">
                        <ActionIcon>
                            <IconPlus />
                        </ActionIcon>
                        <ActionIcon variant="secondary">
                            <IconPlus />
                        </ActionIcon>
                        <ActionIcon variant="light">
                            <IconPlus />
                        </ActionIcon>
                        <ActionIcon variant="outline">
                            <IconPlus />
                        </ActionIcon>
                        <ActionIcon variant="filled">
                            <IconPlus />
                        </ActionIcon>
                        <ActionIcon variant="default">
                            <IconPlus />
                        </ActionIcon>
                        <ActionIcon variant="subtle">
                            <IconPlus />
                        </ActionIcon>
                        <ActionIcon variant="transparent">
                            <IconPlus />
                        </ActionIcon>
                    </Group>

                    <Divider my="xl" />
                    <Group gap="lg">
                        <CloseButton />
                    </Group>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Checkbox
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Checkbox checked={false} label="Default checkbox" />
                    <Checkbox
                        checked={false}
                        indeterminate
                        label="Indeterminate checkbox"
                    />
                    <Checkbox checked label="Checked checkbox" />
                    <Checkbox
                        checked
                        variant="outline"
                        label="Outline checked checkbox"
                    />
                    <Checkbox
                        variant="outline"
                        indeterminate
                        label="Outline indeterminate checkbox"
                    />
                    <Checkbox disabled label="Disabled checkbox" />
                    <Checkbox
                        disabled
                        checked
                        label="Disabled checked checkbox"
                    />
                    <Checkbox
                        disabled
                        indeterminate
                        label="Disabled indeterminate checkbox"
                    />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Chip
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Chip
                        icon={
                            <IconX
                                style={{ width: rem(16), height: rem(16) }}
                            />
                        }
                        color="red"
                        variant="filled"
                        defaultChecked
                    >
                        Forbidden
                    </Chip>

                    <Group>
                        <Tooltip label="Chip tooltip" refProp="rootRef">
                            <Chip defaultChecked>Chip with tooltip</Chip>
                        </Tooltip>
                    </Group>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Input, TextInput, FileInput, PasswordInput, Textarea
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Input placeholder="Title" />
                    <TextInput
                        withAsterisk
                        label="Company name"
                        placeholder="Company name"
                    />
                    <Fieldset legend="Personal information">
                        <TextInput label="Your name" placeholder="Your name" />
                        <TextInput label="Email" placeholder="Email" mt="md" />
                    </Fieldset>
                    <FileInput
                        label="Upload file"
                        description="up to 10MB"
                        placeholder="File"
                    />
                    <PasswordInput
                        label="Password"
                        description="Must be longer than 8 chars"
                        placeholder="Enter password here"
                    />
                    <Textarea
                        label="Bio"
                        description="Tell us a bit more about yourself"
                        placeholder="Enter bio here"
                    />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    NativeSelect
                </Title>
                <Divider my="xl" />
                <Stack>
                    <NativeSelect label="With children options">
                        <optgroup label="Frontend libraries">
                            <option value="react">React</option>
                            <option value="angular">Angular</option>
                            <option value="vue" disabled>
                                Vue
                            </option>
                        </optgroup>

                        <optgroup label="Backend libraries">
                            <option value="express">Express</option>
                            <option value="koa">Koa</option>
                            <option value="django">Django</option>
                        </optgroup>
                    </NativeSelect>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Radio
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Radio checked={false} label="Default radio" />
                    <Radio checked label="Checked radio" />
                    <Radio
                        checked
                        variant="outline"
                        label="Outline checked radio"
                    />
                    <Radio disabled label="Disabled radio" />
                    <Radio disabled checked label="Disabled checked radio" />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Rating
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Rating defaultValue={2} />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    SegmentControl
                </Title>
                <Divider my="xl" />
                <Stack>
                    <SegmentedControl data={["React", "Angular", "Vue"]} />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Slider
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Slider
                        marks={[
                            { value: 20, label: "20%" },
                            { value: 50, label: "50%" },
                            { value: 80, label: "80%" },
                        ]}
                    />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Switch
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Group justify="center">
                        <Switch size="xs" onLabel="ON" offLabel="OFF" />
                        <Switch size="sm" onLabel="ON" offLabel="OFF" />
                        <Switch size="md" onLabel="ON" offLabel="OFF" />
                        <Switch size="lg" onLabel="ON" offLabel="OFF" />
                        <Switch size="xl" onLabel="ON" offLabel="OFF" />
                    </Group>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Autocomplete
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Autocomplete
                        label="Your favorite library"
                        placeholder="Pick value or enter anything"
                        data={["React", "Angular", "Vue", "Svelte"]}
                    />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    MultiSelect
                </Title>
                <Divider my="xl" />
                <Stack>
                    <MultiSelect
                        label="Your favorite libraries"
                        placeholder="Pick value"
                        data={["React", "Angular", "Vue", "Svelte"]}
                        defaultValue={["React"]}
                        clearable
                    />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Pill
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Group>
                        <Pill withRemoveButton>React</Pill>
                    </Group>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Select
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Select
                        label="Your favorite library"
                        placeholder="Pick value"
                        data={["React", "Angular", "Vue", "Svelte"]}
                    />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Anchor
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Group justify="center">
                        <Anchor
                            href="https://mantine.dev/"
                            target="_blank"
                            underline="always"
                        >
                            Underline always
                        </Anchor>
                        <Anchor
                            href="https://mantine.dev/"
                            target="_blank"
                            underline="hover"
                        >
                            Underline hover
                        </Anchor>
                        <Anchor
                            href="https://mantine.dev/"
                            target="_blank"
                            underline="never"
                        >
                            Underline never
                        </Anchor>
                    </Group>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Breadcrumbs
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Breadcrumbs>
                        <Anchor
                            href="https://mantine.dev/"
                            target="_blank"
                            underline="always"
                        >
                            Underline always
                        </Anchor>
                        <Anchor
                            href="https://mantine.dev/"
                            target="_blank"
                            underline="hover"
                        >
                            Underline hover
                        </Anchor>
                        <Anchor
                            href="https://mantine.dev/"
                            target="_blank"
                            underline="never"
                        >
                            Underline never
                        </Anchor>
                    </Breadcrumbs>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    NavLink
                </Title>
                <Divider my="xl" />
                <Stack gap="1">
                    <NavLink
                        href="#required-for-focus"
                        label="With icon"
                        leftSection={<IconHome2 size="1rem" stroke={1.5} />}
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="With right section"
                        leftSection={<IconGauge size="1rem" stroke={1.5} />}
                        rightSection={
                            <IconChevronRight
                                size="0.8rem"
                                stroke={1.5}
                                className="mantine-rotate-rtl"
                            />
                        }
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="Disabled"
                        leftSection={<IconCircleOff size="1rem" stroke={1.5} />}
                        disabled
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="With description"
                        description="Additional information"
                        leftSection={
                            <Badge
                                size="xs"
                                variant="filled"
                                color="red"
                                w={16}
                                h={16}
                                p={0}
                            >
                                3
                            </Badge>
                        }
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="Active subtle"
                        leftSection={<IconActivity size="1rem" stroke={1.5} />}
                        rightSection={
                            <IconChevronRight
                                size="0.8rem"
                                stroke={1.5}
                                className="mantine-rotate-rtl"
                            />
                        }
                        variant="subtle"
                        active
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="Active light"
                        leftSection={<IconActivity size="1rem" stroke={1.5} />}
                        rightSection={
                            <IconChevronRight
                                size="0.8rem"
                                stroke={1.5}
                                className="mantine-rotate-rtl"
                            />
                        }
                        active
                    />
                    <NavLink
                        href="#required-for-focus"
                        label="Active filled"
                        leftSection={<IconActivity size="1rem" stroke={1.5} />}
                        rightSection={
                            <IconChevronRight
                                size="0.8rem"
                                stroke={1.5}
                                className="mantine-rotate-rtl"
                            />
                        }
                        variant="filled"
                        active
                    />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Pagination
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Pagination total={10} />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Stepper
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Stepper iconSize={42} active={1}>
                        <Stepper.Step
                            label="Step 1"
                            description="Create an account"
                        />
                        <Stepper.Step
                            label="Step 2"
                            description="Verify email"
                        />
                        <Stepper.Step label="Step 3" description="Enjoy" />
                    </Stepper>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Tabs
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Tabs defaultValue="first">
                        <Tabs.List>
                            <Tabs.Tab value="first">First tab</Tabs.Tab>
                            <Tabs.Tab value="second">Second tab</Tabs.Tab>
                            <Tabs.Tab value="third">Third tab</Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Loader, Progress
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Loader size={30} />
                    <Progress value={50} />
                </Stack>

                <Title order={3} mb="xl" mt="3xl">
                    Notification
                </Title>
                <Divider my="xl" />
                <Stack>
                    <Notification title="We notify you that">
                        You are now obligated to give a star to Mantine project
                        on GitHub
                    </Notification>
                </Stack>
            </Container>
        </Section>
    );
}
