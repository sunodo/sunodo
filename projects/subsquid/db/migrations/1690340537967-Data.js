module.exports = class Data1690340537967 {
    name = 'Data1690340537967'

    async up(db) {
        await db.query(`CREATE TABLE "authority" ("id" character varying NOT NULL, CONSTRAINT "PK_b0f9bb35ff132fc6bd92d0582ce" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "authority"`)
    }
}
