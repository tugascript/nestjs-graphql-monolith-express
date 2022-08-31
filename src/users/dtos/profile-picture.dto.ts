import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidatePromise } from 'class-validator';
import { FileUploadDto } from '../../uploader/dtos/file-upload.dto';
import { uploadScalar } from '../../uploader/utils/upload-scalar.util';

@ArgsType()
export abstract class ProfilePictureDto {
  @Field(uploadScalar)
  @ValidatePromise()
  @Type(() => FileUploadDto)
  public picture: Promise<FileUploadDto>;
}
