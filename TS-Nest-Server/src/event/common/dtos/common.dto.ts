import { ApiProperty } from '@nestjs/swagger';

export class CommonInputType {

}

export class CommonOutputType {
  @ApiProperty() ok: boolean
  @ApiProperty() error?: string
  @ApiProperty() data?: any
}