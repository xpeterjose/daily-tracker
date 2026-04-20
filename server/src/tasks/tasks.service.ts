import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...dto,
      userId,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(userId: string, date?: string): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .orderBy('task.createdAt', 'ASC');

    if (date) {
      query.andWhere('task.date = :date', { date });
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException();
    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id, userId);

    if (dto.isCompleted !== undefined) {
      task.isCompleted = dto.isCompleted;
      task.completedAt = dto.isCompleted ? new Date() : (undefined as unknown as Date);
    }

    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }

  async getStats(userId: string, date: string): Promise<{ total: number; completed: number }> {
    const tasks = await this.findAll(userId, date);
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.isCompleted).length,
    };
  }
}
