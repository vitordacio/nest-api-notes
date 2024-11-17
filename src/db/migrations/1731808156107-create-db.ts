import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1731808156107 implements MigrationInterface {
    name = 'Migration1731808156107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id_user" uuid NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_fbb07fa6fbd1d74bee9782fb945" PRIMARY KEY ("id_user"))`);
        await queryRunner.query(`CREATE TYPE "public"."notes_type_enum" AS ENUM('Personal', 'Work', 'Reminder')`);
        await queryRunner.query(`CREATE TABLE "notes" ("id_note" uuid NOT NULL, "title" character varying NOT NULL, "content" character varying, "type" "public"."notes_type_enum" NOT NULL DEFAULT 'Personal', "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c75786231d25a41550c276fc8b0" PRIMARY KEY ("id_note"))`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7" FOREIGN KEY ("user_id") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_7708dcb62ff332f0eaf9f0743a7"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`DROP TYPE "public"."notes_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
