import { Button, Center } from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { TbRocket } from "react-icons/tb";

const HomePage: FC = () => {
    return (
        <>
            <Center>
                <Link href="/deploy">
                    <Button leftSection={<TbRocket size={14} />}>Deploy</Button>
                </Link>
            </Center>
        </>
    );
};

export default HomePage;
