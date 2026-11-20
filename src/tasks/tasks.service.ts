import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task } from './interfaces/task.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {
  constructor(private readonly database: DatabaseService) {}

  async getTasks(): Promise<Task[]> {
    const result = await this.database.query(
      'SELECT id, title, completed FROM tasks ORDER BY id',
    );
    return result.rows;
  }

  async createTask(title: string): Promise<Task> {
    const result = await this.database.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed',
      [title],
    );
    return result.rows[0];
  }

  async getTaskById(id: number): Promise<Task> {
    const result = await this.database.query(
      'SELECT id, title, completed FROM tasks WHERE id = $1',
      [id],
    );

    const task = result.rows[0];
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    const result = await this.database.query(
      'UPDATE tasks SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING id, title, completed',
      [data.title, data.completed, id],
    );
    const task = result.rows[0];

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.database.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id],
    );
    if (!result.rows[0]) {
      throw new NotFoundException('Task not found');
    }
  }
}
