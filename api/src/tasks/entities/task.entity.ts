import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '@/tasks/types/status.type';
import { UserWithoutPassword } from '@/users/types/user-without-password.type';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.inProgress,
  })
  status: TaskStatus;

  @Column()
  authorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: UserWithoutPassword;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
