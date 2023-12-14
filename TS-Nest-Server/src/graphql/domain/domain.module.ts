import { Module } from '@nestjs/common';
import { DomainResolver } from './domain.resolver';
import { DomainService } from './domain.service';

@Module({
  providers: [DomainResolver, DomainService]
})
export class DomainModule {}
