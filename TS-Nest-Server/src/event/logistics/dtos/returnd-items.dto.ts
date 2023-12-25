import { CommonOutputType } from '../../common/dtos/common.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnedClothesInput {
  @ApiProperty() clothesId: number
}

export class ReturnedClothesOutput extends CommonOutputType {}