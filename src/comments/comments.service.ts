import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ---------------- CREATE ----------------
  async create(postId: number, userId: number, text: string) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentRepo.create({
      text,
      post,
      user,
    });

    return this.commentRepo.save(comment);
  }

  // ---------------- READ ----------------
  async findForPost(postId: number) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  // ---------------- UPDATE ----------------
  async update(commentId: number, text: string, user: any) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not authorized');
    }

    comment.text = text;
    return this.commentRepo.save(comment);
  }

  // ---------------- DELETE ----------------
  async remove(commentId: number, user: any) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Not authorized');
    }

    return this.commentRepo.remove(comment);
  }
}
