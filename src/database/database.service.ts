import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { promises as fs } from 'node:fs';
import path from 'node:path';

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnModuleInit {
  private readonly pool: Pool;
  constructor(config: ConfigService) {
    this.pool = new Pool({
      host: config.get('PGHOST', 'localhost'),
      port: Number(config.get('PGPORT', '5432')),
      database: config.get('PGDATABASE', 'tasks_api'),
      user: config.get('PGUSER', 'tasks_app'),
      password: config.getOrThrow('PGPASSWORD'),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.query('SELECT 1');
    await this.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY)',
    );
    await this.runMigrations();
  }

  private async runMigrations(): Promise<void> {
    const migrationsDirectory = path.join(
      process.cwd(),
      'database',
      'migrations',
    );
    const files = await fs.readdir(migrationsDirectory);
    const migrations = files.filter((file) => file.endsWith('.sql')).sort();

    for (const migration of migrations) {
      const result = await this.query(
        'SELECT 1 FROM schema_migrations WHERE version = $1', [migration]);
      
      if (result.rows.length === 0) {
        const filePath = path.join(migrationsDirectory, migration);
        const sql = await fs.readFile(filePath, 'utf-8');

        const client = await this.pool.connect();

        try {
          await client.query('BEGIN');
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [migration])
          await client.query('COMMIT')
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      } else {
        console.log('Уже применена')
      }
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  query(sql: string, values: unknown[] = []) {
    return this.pool.query(sql, values);
  }
}
