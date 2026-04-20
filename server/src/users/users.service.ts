import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

interface GoogleProfile {
  googleId: string;
  email: string;
  displayName: string;
  avatar: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreate(profile: GoogleProfile): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      user = this.usersRepository.create(profile);
      await this.usersRepository.save(user);
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
