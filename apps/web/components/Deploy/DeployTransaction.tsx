import { Alert, Button, Group, ScrollArea, Stack, Title } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { FC } from "react";

type DeployTransactionProps = {
    disabled: boolean;
    error?: string;
    loading: boolean;
    onDeploy: () => void;
};

export const DeployTransaction: FC<DeployTransactionProps> = (props) => {
    const { disabled, error, loading, onDeploy } = props;

    return (
        <Stack gap={0}>
            <Title order={5}>Deployment to the base layer</Title>
            <Group>
                {error && (
                    <ScrollArea>
                        <Alert
                            mt={10}
                            variant="light"
                            color="red"
                            icon={<IconExclamationCircle />}
                            ff="mono"
                        >
                            {error}
                        </Alert>
                    </ScrollArea>
                )}
                <Button
                    mt={10}
                    size="md"
                    onClick={onDeploy}
                    disabled={disabled}
                    loading={loading}
                >
                    Deploy
                </Button>
            </Group>
        </Stack>
    );
};
