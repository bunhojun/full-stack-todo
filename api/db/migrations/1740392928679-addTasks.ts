import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTasks1740392928679 implements MigrationInterface {
    name = 'AddTasks1740392928679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('done', 'inProgress')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "status" "public"."task_status_enum" NOT NULL DEFAULT 'inProgress', "authorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_30cb9d78297c1f2a2e07df1a616" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_30cb9d78297c1f2a2e07df1a616"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    }

}
