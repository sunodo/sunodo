module.exports = class Data1696313838238 {
    name = 'Data1696313838238'

    async up(db) {
        await db.query(`CREATE TABLE "application" ("id" character varying NOT NULL, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "validator_node" ("id" character varying NOT NULL, "runway" numeric, "location" text, "application_id" character varying, "provider_id" character varying, CONSTRAINT "PK_cc0fae80b68d3c7e4929b846da8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_620ac06bbf5dcf4692fcd7d6da" ON "validator_node" ("application_id") `)
        await db.query(`CREATE INDEX "IDX_ca05fc469559790a26dd6bca6b" ON "validator_node" ("provider_id") `)
        await db.query(`ALTER TABLE "validator_node_provider" ADD "paused" boolean NOT NULL`)
        await db.query(`ALTER TABLE "validator_node" ADD CONSTRAINT "FK_620ac06bbf5dcf4692fcd7d6da0" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "validator_node" ADD CONSTRAINT "FK_ca05fc469559790a26dd6bca6be" FOREIGN KEY ("provider_id") REFERENCES "validator_node_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "application"`)
        await db.query(`DROP TABLE "validator_node"`)
        await db.query(`DROP INDEX "public"."IDX_620ac06bbf5dcf4692fcd7d6da"`)
        await db.query(`DROP INDEX "public"."IDX_ca05fc469559790a26dd6bca6b"`)
        await db.query(`ALTER TABLE "validator_node_provider" DROP COLUMN "paused"`)
        await db.query(`ALTER TABLE "validator_node" DROP CONSTRAINT "FK_620ac06bbf5dcf4692fcd7d6da0"`)
        await db.query(`ALTER TABLE "validator_node" DROP CONSTRAINT "FK_ca05fc469559790a26dd6bca6be"`)
    }
}
