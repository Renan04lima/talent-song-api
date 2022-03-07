import { MigrationInterface, QueryRunner } from 'typeorm'

export class version011646668961788 implements MigrationInterface {
  name = 'version011646668961788'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await queryRunner.query('CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying UNIQUE NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))')
    await queryRunner.query('CREATE TABLE "favorite_songs" ("favorite_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "song_name" character varying NOT NULL, "artist" character varying NOT NULL, "album" character varying NOT NULL, "user_id" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_641a82f8947b3faf4fdb14a6885" PRIMARY KEY ("favorite_id"))')
    await queryRunner.query('ALTER TABLE "favorite_songs" ADD CONSTRAINT "FK_bf872af2ebe6f01177ce7f791b3" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION')
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "favorite_songs" DROP CONSTRAINT "FK_bf872af2ebe6f01177ce7f791b3"')
    await queryRunner.query('DROP TABLE "favorite_songs"')
    await queryRunner.query('DROP TABLE "users"')
  }
}
