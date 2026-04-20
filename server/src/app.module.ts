import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');
        
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            entities: [User, Task],
            synchronize: true, // Only for demo/MVP, usually false in real production
            ssl: { rejectUnauthorized: false }, // Common for cloud Postgres (Render/Railway)
          };
        }

        return {
          type: 'better-sqlite3',
          database: config.get<string>('DATABASE_PATH', './daily-tracker.sqlite'),
          entities: [User, Task],
          synchronize: true,
          logging: false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
