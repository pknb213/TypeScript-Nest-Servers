import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PodcastsModule } from './podcast/podcasts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PodcastsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
