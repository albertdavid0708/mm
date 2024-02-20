import { MigrationInterface, QueryRunner } from 'typeorm'

export class TimestampSample implements MigrationInterface {
	public async up (queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE User ADD COLUMN price int')
	}

	public async down (queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE User DROP COLUMN price')
	}
}
