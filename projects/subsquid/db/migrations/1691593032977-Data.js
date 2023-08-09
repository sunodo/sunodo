module.exports = class Data1691593032977 {
    name = 'Data1691593032977'

    async up(db) {
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "symbol" text NOT NULL, "name" text NOT NULL, "decimals" integer NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "factory" ("id" character varying NOT NULL, "price" numeric NOT NULL, "authority_id" character varying, "token_id" character varying, CONSTRAINT "PK_1372e5a7d114a3fa80736ba66bb" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_106274a37b133f80e5a4788826" ON "factory" ("authority_id") `)
        await db.query(`CREATE INDEX "IDX_5bfdf3656c5aca31c5f83e7d73" ON "factory" ("token_id") `)
        await db.query(`ALTER TABLE "factory" ADD CONSTRAINT "FK_106274a37b133f80e5a47888263" FOREIGN KEY ("authority_id") REFERENCES "authority"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "factory" ADD CONSTRAINT "FK_5bfdf3656c5aca31c5f83e7d73f" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP TABLE "factory"`)
        await db.query(`DROP INDEX "public"."IDX_106274a37b133f80e5a4788826"`)
        await db.query(`DROP INDEX "public"."IDX_5bfdf3656c5aca31c5f83e7d73"`)
        await db.query(`ALTER TABLE "factory" DROP CONSTRAINT "FK_106274a37b133f80e5a47888263"`)
        await db.query(`ALTER TABLE "factory" DROP CONSTRAINT "FK_5bfdf3656c5aca31c5f83e7d73f"`)
    }
}
