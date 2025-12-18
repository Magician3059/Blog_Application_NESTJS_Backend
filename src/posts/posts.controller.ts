import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { ResponsePostDto } from './dto/responsepost.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '../permissions/permissions.decorator';
import { Permission } from 'src/permissions/permissions.enum';
// import { Serialize } from '../common/serialize.decorator';
import { UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { SerializeOptions } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { multerConfig } from 'src/common/multer.config';
import { ApiBody } from '@nestjs/swagger';
import { ApiConsumes } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
// @UseGuards(AuthGuard('jwt')) : Now using Global Level AuthGuard
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('allposts')
  @UseInterceptors(ClassSerializerInterceptor) // Intercept response & serialize it with respect to CreateCategoryDto & exclude ...
  @SerializeOptions({
    type: ResponsePostDto,
    excludePrefixes: ['updatedAt'],
  })
  findAllPosts() {
    return this.postsService.findAllPosts();
  }

  // -------------------------------------------------------------------------------------------------------------------------
  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('files', 5, multerConfig))
  //  Swagger Condfig to upload file
  @ApiConsumes('multipart/form-data') // Swagger UI Will Show files[] input & Multiple file selection , Correct multipart request
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  uploadFilesToPost(
    @Param('id', ParseIntPipe) postId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postsService.addAttachments(postId, files);
  }

  // --------------------------------------------------------------------------------------------------------------------------

  @Get()
  @UseInterceptors(ClassSerializerInterceptor) // Intercept response & serialize it with respect to CreateCategoryDto & exclude ...
  @SerializeOptions({
    type: ResponsePostDto,
    excludePrefixes: ['name', 'email', 'role', 'createdAt'],
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.postsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || '',
    });
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor) // Intercept response & serialize it with respect to CreateCategoryDto & exclude ...
  @SerializeOptions({
    type: ResponsePostDto,
    excludePrefixes: ['name', 'email', 'role', 'createdAt'],
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(Number(id));
  }

  @Permissions(Permission.POST_CREATE)
  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: CreatePostDto,
    excludePrefixes: ['role', 'createdAt', 'updatedAt', 'password'],
  })
  create(@Body() dto: CreatePostDto, @Req() req) {
    return this.postsService.create(dto, req.user.id);
  }

  @Permissions(Permission.POST_UPDATE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto, // Technique : PartialType will make use of CreatePostDto & all feilds in it can be updated partially
    @Req() req,
  ) {
    return this.postsService.update(Number(id), dto, req.user);
  }

  @Permissions(Permission.POST_DELETE)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.postsService.remove(Number(id), req.user);
  }
}
