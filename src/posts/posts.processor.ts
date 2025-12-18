import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { NotFoundException } from '@nestjs/common';

@Processor('post-attachments')
export class PostsProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>) {
    switch (job.name) {
      case 'add-attachments':
        return this.handleAddAttachments(job);
    }
  }

  private async handleAddAttachments(
    job: Job<{ postId: number; filePaths: string[] }>,
  ) {
    const { postId, filePaths } = job.data;

    const post = await this.postRepo.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.attachments = [...(post.attachments ?? []), ...filePaths];

    console.log('Processing job:', job.id, job.data);

    await this.postRepo.save(post);

    return { status: 'attachments-added' };
  }
}
