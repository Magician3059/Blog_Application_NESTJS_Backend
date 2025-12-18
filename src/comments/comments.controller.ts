import {
  Body,
  Controller,
  Get,
  Param,
  Post as HttpPost,
  Patch,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@ApiBearerAuth('access-token')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // CREATE COMMENT
  @HttpPost(':postId')
  addComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body('text') text: string,
    @Req() req,
  ) {
    return this.commentsService.create(postId, req.user.id, text);
  }

  // READ COMMENTS FOR POST
  @Get(':postId')
  findForPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentsService.findForPost(postId);
  }

  // UPDATE COMMENT
  @Patch(':id')
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body('text') text: string,
    @Req() req,
  ) {
    return this.commentsService.update(id, text, req.user);
  }

  // DELETE COMMENT
  @Delete(':id')
  removeComment(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.commentsService.remove(id, req.user);
  }
}
