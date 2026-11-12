import { Controller, Get } from '@nestjs/common';
import type { Task } from './interfaces/task.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }
    
    @Get()
    getTasks(): Task[] {
        return this.tasksService.getTasks()
    }
}
