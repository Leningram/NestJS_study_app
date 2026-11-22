import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

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
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  query(sql: string, values: unknown[] = []) {
    return this.pool.query(sql, values);
  }
}
