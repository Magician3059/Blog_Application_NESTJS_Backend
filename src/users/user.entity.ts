import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity() // This class becomes a table in database named "user".
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole; //Stored as ENUM type in DB | Allowed values: 'USER' or 'ADMIN' |  Default value → 'USER'

  @CreateDateColumn() // Auto-generated timestamp column.
  createdAt: Date;

  //Relationship: One user can have many posts
  @OneToMany(() => Post, (post) => post.author) // Maps to post.author relation inside Post entity.
  posts: Post[];

  //Relationship: One user can have many comments.
  @OneToMany(() => Comment, (c) => c.user) // c.user refers to relation field in Comment entity.
  comments: Comment[];
}
