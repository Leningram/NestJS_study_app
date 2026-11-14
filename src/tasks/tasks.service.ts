import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task } from './interfaces/task.interface';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  tasks: Task[] = [
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

  getTasks(): Task[] {
    return this.tasks;
  }

  createTask(title: string): Task {
    const id = this.tasks.length + 1;
    const task: Task = { id, title, completed: false };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  updateTask(id: number, data: UpdateTaskDto) {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    Object.assign(task, data);
    return task;
  }

  deleteTask(id: number): void {
    const taskIndex = this.tasks.findIndex((item) => item.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException('Task not found');
    }
    this.tasks.splice(taskIndex, 1);
  }
}
