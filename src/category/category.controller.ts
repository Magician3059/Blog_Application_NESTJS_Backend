import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permission } from 'src/permissions/permissions.enum';
import { Permissions } from '../permissions/permissions.decorator';
import { UseInterceptors } from '@nestjs/common';
import { SerializeOptions } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';

@ApiBearerAuth('access-token')
// @UseGuards(AuthGuard('jwt')): Now using Global Level AuthGuard
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseInterceptors(ClassSerializerInterceptor) // Intercept response & serialize it with respect to CreateCategoryDto & exclude ...
  @SerializeOptions({
    type: CreateCategoryDto,
    excludePrefixes: ['createdAt', 'updatedAt'],
  })
  @Permissions(Permission.CATEGORY_CREATE)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: ResponseCategoryDto,
    excludePrefixes: ['updatedAt', 'createdAt'],
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: ResponseCategoryDto,
    excludePrefixes: ['updatedAt', 'createdAt'],
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    // Id received by params is string but, Global validation pipe transforms it into Integer
    console.log(
      'Global Validator Converted (Id) String-->Integer: Check is type number : ',
      typeof id === 'number',
    ); // true

    console.log(
      ' Even though GlobalValidator convert it its not best practice to follow becoz it does not throw any error on wrong input ',
    );
    return this.categoryService.findOne(id);
  }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.categoryService.findOne(id);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoryService.findOne(+id);// Use Unary (+) : Convert String to Integer
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: ResponseCategoryDto,
    excludePrefixes: ['post', 'updatedAt', 'createdAt'],
  })
  @Permissions(Permission.CATEGORY_UPDATE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    type: ResponseCategoryDto,
    excludePrefixes: ['post', 'updatedAt', 'createdAt'],
  })
  @Permissions(Permission.CATEGORY_DELETE)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
