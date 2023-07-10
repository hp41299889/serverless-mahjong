import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1688955623174 implements MigrationInterface {
    name = 'Migration1688955623174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7baa5220210c74f8db27c06f8b4" UNIQUE ("name"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."record_endtype_enum" AS ENUM('winning', 'self-drawn', 'draw', 'fake')`);
        await queryRunner.query(`CREATE TABLE "record" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "endType" "public"."record_endtype_enum" NOT NULL, "point" integer, "created_at" TIMESTAMP NOT NULL, "roundUid" uuid, "winnerId" integer, CONSTRAINT "PK_8de44784d54d4397e7cce8fcd37" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TYPE "public"."round_desktype_enum" AS ENUM('auto', 'manual')`);
        await queryRunner.query(`CREATE TABLE "round" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "deskType" "public"."round_desktype_enum" NOT NULL DEFAULT 'auto', "base" integer NOT NULL, "point" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "eastId" integer, "southId" integer, "westId" integer, "northId" integer, CONSTRAINT "PK_3eb2356a4d7d48675d66bd91363" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "record_losers" ("recordUid" uuid NOT NULL, "playerId" integer NOT NULL, CONSTRAINT "PK_df5d84c7f5eb076c6e6246e2e0f" PRIMARY KEY ("recordUid", "playerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d94fcc893c8dc8837c9a829269" ON "record_losers" ("recordUid") `);
        await queryRunner.query(`CREATE INDEX "IDX_b1afd9d1db077de1369a3b345c" ON "record_losers" ("playerId") `);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_9fef4d68af13d466d9b3537ef85" FOREIGN KEY ("roundUid") REFERENCES "round"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_85de52a4f5de7f454a9f1154464" FOREIGN KEY ("winnerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_bdac3053e6593e58cbffafd2951" FOREIGN KEY ("eastId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_b3798cabfe883e3b2dcc73d6e63" FOREIGN KEY ("southId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_b96a601b023efa278a75d867fdf" FOREIGN KEY ("westId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_bf7283631b3f9cd1a8c4c32e866" FOREIGN KEY ("northId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record_losers" ADD CONSTRAINT "FK_d94fcc893c8dc8837c9a8292699" FOREIGN KEY ("recordUid") REFERENCES "record"("uid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "record_losers" ADD CONSTRAINT "FK_b1afd9d1db077de1369a3b345c6" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record_losers" DROP CONSTRAINT "FK_b1afd9d1db077de1369a3b345c6"`);
        await queryRunner.query(`ALTER TABLE "record_losers" DROP CONSTRAINT "FK_d94fcc893c8dc8837c9a8292699"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_bf7283631b3f9cd1a8c4c32e866"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_b96a601b023efa278a75d867fdf"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_b3798cabfe883e3b2dcc73d6e63"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_bdac3053e6593e58cbffafd2951"`);
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_85de52a4f5de7f454a9f1154464"`);
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_9fef4d68af13d466d9b3537ef85"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1afd9d1db077de1369a3b345c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d94fcc893c8dc8837c9a829269"`);
        await queryRunner.query(`DROP TABLE "record_losers"`);
        await queryRunner.query(`DROP TABLE "round"`);
        await queryRunner.query(`DROP TYPE "public"."round_desktype_enum"`);
        await queryRunner.query(`DROP TABLE "record"`);
        await queryRunner.query(`DROP TYPE "public"."record_endtype_enum"`);
        await queryRunner.query(`DROP TABLE "player"`);
    }

}
