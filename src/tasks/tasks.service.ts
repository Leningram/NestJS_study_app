import { Injectable } from '@nestjs/common';
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
    }
]

@Injectable()
export class TasksService {
  getTasks(): Task[] {
    return tasks;
  }
}
