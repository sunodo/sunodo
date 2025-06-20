import { onchainTable } from "ponder";

export const application = onchainTable("application", (p) => ({
    // onchain application address
    address: p.hex().primaryKey(),

    // status of machine download
    localStatus: p
        .varchar({ enum: ["ERROR", "PENDING", "SUCCESS"] })
        .notNull()
        .default("PENDING"),

    // location, emmited by IMachineProtocol
    location: p.varchar(),

    // status, as in rollups-node
    status: p.varchar({ enum: ["ENABLED", "DISABLED"] }),

    // template hash (onchain immutable)
    templateHash: p.varchar().notNull(),

    // payment deadline, emmited by IFinancialProtocol
    until: p.bigint(),
}));
