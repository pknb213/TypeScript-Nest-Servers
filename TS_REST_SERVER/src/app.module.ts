import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastsModule } from './rest/podcast/podcasts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './rest/auth/auth.module';
import { DomainModule } from './graphql/domain/domain.module';

@Module({
  imports: [
    PodcastsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: true,
      synchronize: true,
    }),
    AuthModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
