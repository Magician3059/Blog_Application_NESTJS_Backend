import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

///we are following DRY(Do not Repete Yourself ) Principal
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {} //PartialType will reuse Createcategorydto & allow us to update it partially
