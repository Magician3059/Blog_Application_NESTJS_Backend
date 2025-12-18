import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/createpost.dto';
import { ResponsePostDto } from './dto/responsepost.dto';
import { UsersService } from '../users/users.service';
import { Category } from '../category/entities/category.entity';

import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UpdatePostDto } from './dto/updatepost.dto';
import { plainToInstance } from 'class-transformer';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,

    private usersService: UsersService,

    @InjectRepository(Category)
    private catRepo: Repository<Category>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache, //cashing

    @InjectQueue('post-attachments') // Add Job to Queue
    private attachmentsQueue: Queue,
  ) {}

  // -------------------------------------------------------------------------------------------------------
  // async addAttachments(postId: number, files: Express.Multer.File[]) {
  //   const post = await this.repo.findOne({ where: { id: postId } });
  //   if (!post) throw new NotFoundException('Post not found');

  //   const filePaths = files.map((file) => `/uploads/posts/${file.filename}`);

  //   post.attachments = [...(post.attachments ?? []), ...filePaths];

  //   return this.repo.save(post);
  // }

  async addAttachments(postId: number, files: Express.Multer.File[]) {
    const post = await this.repo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    /**
     * Convert Multer files into serializable payload
     * (Redis cannot store file buffers safely)
     */
    const filePaths = files.map((file) => `/uploads/posts/${file.filename}`);

    /**
     * Enqueue job instead of DB write
     */
    await this.attachmentsQueue.add(
      'add-attachments',
      { postId, filePaths },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      },
    );

    // post.attachments = [...(post.attachments ?? []), ...filePaths];

    // await this.repo.save(post);

    /**
     * Immediate response to client
     */
    return {
      message: ' Processing in background.',
    };
  }

  //-----------------------------------------------------------------------------------------------------------
  async create(dto: CreatePostDto, userId: number) {
    const author = await this.usersService.findById(userId);
    if (!author) throw new NotFoundException('Author not found');

    // category can be undefined if not found
    let category: Category | undefined;
    if (dto.categoryId) {
      category =
        (await this.catRepo.findOne({ where: { id: dto.categoryId } })) ??
        undefined;
      if (!category) throw new NotFoundException('Category not found');
    }

    // ✅ Production-standard rule
    // Use spread (...dto) ONLY when:
    const post = this.repo.create({
      ...dto, //Using ...dto is acceptable only with strict ValidationPipe configuration to prevent mass assignment. For sensitive or high-risk entities, explicit field mapping is safer and preferred.”
      author,
      category, // undefined if no category
    });

    // const post = this.repo.create({
    //   title: dto.title,
    //   content: dto.content,
    //   author,
    //   category, // undefined if no category
    // });

    return this.repo.save(post);
  }

  //---------------------------------------------------------------------------------------------------------

  // async create(dto: CreatePostDto, userId: number) {
  //   const author = await this.usersService.findById(userId);
  //   if (!author) throw new NotFoundException('Author not found');

  //   const category = dto.categoryId
  //   ? await this.catRepo.findOne({ where: { id: dto.categoryId } })
  //   : undefined; // NOT null

  // const post = this.repo.create({
  //   title: dto.title,
  //   content: dto.content,
  //   author,
  //   category, // undefined if no category
  // });

  //   return this.repo.save(post);
  // }

  async findAllPosts(): Promise<ResponsePostDto[]> {
    const cacheKey = 'posts:all';

    // 1️⃣ Cache first
    const cached = await this.cacheManager.get<ResponsePostDto[]>(cacheKey);
    if (cached) return cached;

    // 2️⃣ Fetch from DB
    const posts = await this.repo.find({
      relations: ['author', 'category'], // add relations you need
      // order: { createdAt: 'DESC' },
    });

    // 3️⃣ Map Entity → Response DTO
    const response = plainToInstance(ResponsePostDto, posts, {
      excludeExtraneousValues: true,
    });

    // 4️⃣ Cache result
    await this.cacheManager.set(cacheKey, response, 60);

    return response;
  }

  // PAGINATION
  async findAll({ page = 1, limit = 10, search = '' } = {}) {
    const cacheKey = `posts:page=${page}:limit=${limit}:search=${search}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const qb = this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    if (search) {
      qb.where('post.title ILIKE :search OR post.content ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const result = await qb.getManyAndCount();

    await this.cacheManager.set(cacheKey, result, 30); // short TTL

    return {
      items: result[0],
      total: result[1],
      page,
      limit,
    };
  }

  // async findAll({ page = 1, limit = 10, search = '' } = {}) {
  //   const qb = this.repo
  //     .createQueryBuilder('post')
  //     .leftJoinAndSelect('post.author', 'author')
  //     .leftJoinAndSelect('post.category', 'category')
  //     .orderBy('post.createdAt', 'DESC')
  //     .take(limit)
  //     .skip((page - 1) * limit);

  //   if (search)
  //     qb.where('post.title ILIKE :search OR post.content ILIKE :search', {
  //       search: `%${search}%`,
  //     });

  //   const [items, total] = await qb.getManyAndCount();
  //   return { items, total, page, limit };
  // }

  // redis
  // First request → DB
  // Next requests → Redis (very fast)
  async findOne(id: number) {
    const cacheKey = `post:${id}`;

    // 1️⃣ Try cache first
    const cachedPost = await this.cacheManager.get<Post>(cacheKey);
    if (cachedPost) {
      return cachedPost;
    }

    // 2️⃣ Fetch from DB
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found'); //Exception Handling

    // 3️⃣ Store in cache (TTL: 120s)
    await this.cacheManager.set(cacheKey, post, 120);

    // const dto = plainToInstance(ResponsePostDto, post, {
    //   excludeExtraneousValues: true,
    // });

    // return {
    //   author: post.author,
    //   title: post.title,
    //   content: post.content,
    //   category: post.category,
    //   comments: post.comments,
    // };
    // return plainToInstance(ResponsePostDto, post);
    return post;
  }

  // async findOne(id: number) {
  //   const post = await this.repo.findOne({ where: { id } });
  //   if (!post) throw new NotFoundException('Post not found');
  //   return post;
  // }

  async update(id: number, dto: UpdatePostDto, user: any) {
    const post = await this.findOne(id);
    if (post.author.id !== user.id && user.role !== 'ADMIN')
      throw new ForbiddenException('Not authorized');
    Object.assign(post, dto);
    const updatedPost = await this.repo.save(post);

    // 🔴 Invalidate cache
    await this.cacheManager.del(`post:${id}`); //we are removing old cashed object on update

    return updatedPost;
  }

  async remove(id: number, user: any) {
    const post = await this.findOne(id);

    if (post.author.id !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Not authorized');
    }

    await this.repo.remove(post);

    // 🔴 Invalidate cache : Delete using Key
    await this.cacheManager.del(`post:${id}`);

    return { message: 'Post deleted successfully' };
  }
}
