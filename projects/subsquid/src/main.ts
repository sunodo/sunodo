import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { decodeEventLog, Hex } from "viem";

import { authorityFactoryABI } from "./abi/contracts";
import { Authority } from "./model";
import { createDatasource } from "./datasource";

const { datasource, finalityConfirmation, contracts } = createDatasource();

const processor = new EvmBatchProcessor()
    .setDataSource(datasource)
    .setFinalityConfirmation(finalityConfirmation)
    .addLog({
        address: [contracts.AuthorityFactory.address.toLowerCase()],
        range: { from: contracts.AuthorityFactory.block },
        topic0: [contracts.AuthorityFactory.events.AuthorityCreated.topic0],
    });

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const authorities: Authority[] = [];
    for (const block of ctx.blocks) {
        for (const log of block.logs) {
            if (
                log.address === contracts.AuthorityFactory.address.toLowerCase()
            ) {
                const [signature, ...args] = log.topics.map((t) => t as Hex);
                const event = decodeEventLog<
                    typeof authorityFactoryABI,
                    "AuthorityCreated",
                    Hex[],
                    Hex,
                    true
                >({
                    abi: authorityFactoryABI,
                    topics: [signature, ...args],
                    data: log.data as Hex,
                    strict: true,
                });
                const { authority } = event.args;
                ctx.log.info(`saving authority ${authority}`);
                authorities.push(new Authority({ id: authority.toString() }));
            }
        }
    }
    await ctx.store.upsert(authorities);
});
