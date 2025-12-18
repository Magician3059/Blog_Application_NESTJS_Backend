import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './createpost.dto';

// DRY(Do not repete yourself ) Principal
//Technique : PartialType will make use of CreatePostDto & all feilds in it can be updated partially
export class UpdatePostDto extends PartialType(CreatePostDto) {} //Allow to partially Update CreatepostDto
