import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1767928434940 implements MigrationInterface {
    name = 'InitialMigration1767928434940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "role" character varying(50) NOT NULL DEFAULT 'admin', "is_active" boolean NOT NULL DEFAULT true, "last_login_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_051db7d37d478a69a7432df147" ON "admins" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_e4e8d6a12aaa6d04144d5fd827" ON "admins" ("is_active") `);
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "api_id" character varying(255) NOT NULL, "title" character varying(500) NOT NULL, "description" text, "content" text, "url" text NOT NULL, "image_url" text, "source" character varying(100), "author" character varying(255), "category" character varying(50) NOT NULL, "published_at" TIMESTAMP NOT NULL, "last_synced_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, CONSTRAINT "UQ_41ced9488c8c6cebea7a8f176ea" UNIQUE ("api_id"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_41ced9488c8c6cebea7a8f176e" ON "articles" ("api_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce46da62a5e412ebd1c0cf332e" ON "articles" ("category") `);
        await queryRunner.query(`CREATE INDEX "IDX_6f7a13d016a867d93e90bcb1b6" ON "articles" ("published_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c6afe716f2efa35d9a803dd40" ON "articles" ("updated_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_93c112ea984ff2e43deaa5dd20" ON "articles" ("created_by") `);
        await queryRunner.query(`CREATE TABLE "sync_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "synced_count" integer NOT NULL DEFAULT '0', "updated_count" integer NOT NULL DEFAULT '0', "skipped_count" integer NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL, "error_message" text, "started_at" TIMESTAMP NOT NULL DEFAULT now(), "completed_at" TIMESTAMP, "duration_ms" integer, "triggered_by" uuid, CONSTRAINT "PK_f441fe15484e077c80ddec89336" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6aff441a1c880e784f1583f524" ON "sync_logs" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a1b2d8f536b91e1027eaa93db" ON "sync_logs" ("started_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_473b76bd1edcaa0cc3441e0fa7" ON "sync_logs" ("triggered_by") `);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_93c112ea984ff2e43deaa5dd202" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_bdb780e06671ab00c66102c7997" FOREIGN KEY ("updated_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sync_logs" ADD CONSTRAINT "FK_473b76bd1edcaa0cc3441e0fa7c" FOREIGN KEY ("triggered_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sync_logs" DROP CONSTRAINT "FK_473b76bd1edcaa0cc3441e0fa7c"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_bdb780e06671ab00c66102c7997"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_93c112ea984ff2e43deaa5dd202"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_473b76bd1edcaa0cc3441e0fa7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a1b2d8f536b91e1027eaa93db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6aff441a1c880e784f1583f524"`);
        await queryRunner.query(`DROP TABLE "sync_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_93c112ea984ff2e43deaa5dd20"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c6afe716f2efa35d9a803dd40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f7a13d016a867d93e90bcb1b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce46da62a5e412ebd1c0cf332e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_41ced9488c8c6cebea7a8f176e"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4e8d6a12aaa6d04144d5fd827"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_051db7d37d478a69a7432df147"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
