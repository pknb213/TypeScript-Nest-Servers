import { CommonOutputType } from '../../common/dtos/common.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StoredClothesInput {
  @ApiProperty() clothesId: number
}

export class StoredClothesOutput extends CommonOutputType {}