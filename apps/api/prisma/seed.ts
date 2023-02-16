import { AccountType, ConsensusType, PrismaClient } from "@prisma/client";
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

    // plans
    await prisma.plan.upsert({
        where: { id: "19bcbead-eb37-45f1-b76c-ba546d1abd34" },
        create: {
            id: "19bcbead-eb37-45f1-b76c-ba546d1abd34",
            name: "personal",
            label: "Personal Plan",
            accountTypes: [AccountType.USER],
            active: true,
            default: true,
            stripePriceId: "price_1MZzQqHytG4GeYTNTUrZstr3",
        },
        update: {},
    });
    await prisma.plan.upsert({
        where: { id: "9a0729c0-43f6-4863-ae97-d17f1fbfb8a0" },
        create: {
            id: "9a0729c0-43f6-4863-ae97-d17f1fbfb8a0",
            name: "business",
            label: "Business Plan",
            accountTypes: [AccountType.ORGANIZATION],
            active: true,
            default: true,
            stripePriceId: "price_1Ma2ZjHytG4GeYTNxFTYvRbP",
        },
        update: {},
    });

    // sunodo validator
    const validator = await prisma.validator.upsert({
        where: { id: "a85afef5-7bf7-49ba-a043-d22afab0f800" },
        create: {
            id: "a85afef5-7bf7-49ba-a043-d22afab0f800",
            address: "0xDD21AE38D6215479F3364D3Cf7d9D27aD209BD89",
            keyRef: "aee74f4a-ed99-4276-8bf8-faf45f5d625e", // AWS KEY ID
        },
        update: {
            address: "0xDD21AE38D6215479F3364D3Cf7d9D27aD209BD89",
            keyRef: "aee74f4a-ed99-4276-8bf8-faf45f5d625e", // AWS KEY ID
        },
    });
    // sunodo authority consensus
    await prisma.consensus.upsert({
        where: { id: "19054807-08c5-49e2-9416-130e38b1cbce" },
        create: {
            id: "19054807-08c5-49e2-9416-130e38b1cbce",
            type: ConsensusType.AUTHORITY,
            validators: { connect: validator },
        },
        update: { validators: { connect: validator } },
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
