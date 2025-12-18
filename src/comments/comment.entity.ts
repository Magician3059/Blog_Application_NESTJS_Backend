import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Entity() // ← This is crucial, without it TypeORM ignores this class
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text') // ← column decorator is needed
  text: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' }) // ← proper relation
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, { eager: true }) // ← relation with User
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
