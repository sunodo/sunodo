import { PrismaClient } from "@prisma/client";

export const createTestApplication = async (
    prisma: PrismaClient,
    args: { name: string; accountId: string }
) => {
    const { name, accountId } = args;
    return prisma.application.create({
        data: { name, account: { connect: { id: accountId } } },
    });
};
