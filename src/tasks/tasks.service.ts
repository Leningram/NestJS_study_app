import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task } from './interfaces/task.interface';

const tasks: Task[] = [
  {
    id: 1,
    title: 'Первая задача',
    completed: true,
  },
  {
    id: 2,
    title: 'Вторая задача',
    completed: false,
  },
];

@Injectable()
export class TasksService {
  getTasks(): Task[] {
    return tasks;
  }

  createTask(title: string): Task {
    const id = tasks.length + 1;
    const task: Task = { id, title, completed: false };
    tasks.push(task);
    return task;
  }

  getTaskById(id: number): Task {
    const task = tasks.find((item) => item.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
