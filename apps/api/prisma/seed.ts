import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.chain.upsert({
        where: { id: 5 },
        update: {},
        create: {
            id: 5,
            name: "goerli",
            label: "Goerli",
            testnet: true,
            enabled: true,
        },
    });
    await prisma.chain.upsert({
        where: { id: 420 },
        update: {},
        create: {
            id: 420,
            name: "optimism-goerli",
            label: "Optimism Goerli",
            testnet: true,
            enabled: true,
        },
    });
    await prisma.region.upsert({
        where: {
            name: "us",
        },
        update: {},
        create: {
            name: "us",
            default: true,
            kubeConfigSecret: "us",
        },
    });
    await prisma.runtime.upsert({
        where: {
            name: "0.9.0",
        },
        update: {},
        create: {
            name: "0.9.0",
            default: true,
        },
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
