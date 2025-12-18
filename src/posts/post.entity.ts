import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../category/entities/category.entity';
import { Comment } from '../comments/comment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  @ManyToOne(() => Category, (category) => category.post, {
    eager: true,
    nullable: true,
  })
  category?: Category;

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];

  @Column('json', { nullable: true })
  attachments?: string[]; // multiple files

  //-----------------------------
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //-----------------------------
}
