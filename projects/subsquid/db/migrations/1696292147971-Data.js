module.exports = class Data1696292147971 {
    name = 'Data1696292147971'

    async up(db) {
        await db.query(`CREATE TABLE "reader_node_provider" ("id" character varying NOT NULL, "payee" text NOT NULL, "price" numeric NOT NULL, "token_id" character varying, CONSTRAINT "PK_b9fe99e6fbe1332811632dba31b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_09ca682d101c0203265d38116c" ON "reader_node_provider" ("token_id") `)
        await db.query(`CREATE TABLE "validator_node_provider" ("id" character varying NOT NULL, "payee" text NOT NULL, "price" numeric NOT NULL, "authority_id" character varying, "token_id" character varying, CONSTRAINT "PK_ca05fc469559790a26dd6bca6be" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0551b931f1793eeaad67e0b254" ON "validator_node_provider" ("authority_id") `)
        await db.query(`CREATE INDEX "IDX_ba5f3d920d2961e583599fbfda" ON "validator_node_provider" ("token_id") `)
        await db.query(`ALTER TABLE "reader_node_provider" ADD CONSTRAINT "FK_09ca682d101c0203265d38116cf" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "validator_node_provider" ADD CONSTRAINT "FK_0551b931f1793eeaad67e0b254d" FOREIGN KEY ("authority_id") REFERENCES "authority"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "validator_node_provider" ADD CONSTRAINT "FK_ba5f3d920d2961e583599fbfdae" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "reader_node_provider"`)
        await db.query(`DROP INDEX "public"."IDX_09ca682d101c0203265d38116c"`)
        await db.query(`DROP TABLE "validator_node_provider"`)
        await db.query(`DROP INDEX "public"."IDX_0551b931f1793eeaad67e0b254"`)
        await db.query(`DROP INDEX "public"."IDX_ba5f3d920d2961e583599fbfda"`)
        await db.query(`ALTER TABLE "reader_node_provider" DROP CONSTRAINT "FK_09ca682d101c0203265d38116cf"`)
        await db.query(`ALTER TABLE "validator_node_provider" DROP CONSTRAINT "FK_0551b931f1793eeaad67e0b254d"`)
        await db.query(`ALTER TABLE "validator_node_provider" DROP CONSTRAINT "FK_ba5f3d920d2961e583599fbfdae"`)
    }
}
