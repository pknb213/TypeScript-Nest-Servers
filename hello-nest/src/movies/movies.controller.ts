import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import * as querystring from "querystring";
import {Movie} from './entitys/movie.entity';
import {MoviesService} from "./movies.service";
import {CreateMovieDto} from "./dto/create_movie.dto";
import {UpdateMovieDto} from "./dto/update_movie.dto";

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {
    }

    @Get()
    getAll(): Movie[] {
        return this.moviesService.getAll()
    }

    @Get("search")
    search(@Query("year") searchYear: string) {
        return searchYear
    }

    // @Get(":id")
    // getOne(@Param("id") movieId: number): Movie {
    //     return this.moviesService.getOne(movieId)
    // }

    @Get(":id")
    getOne(@Param("id") movieId: number): Movie { // Todo: 왜 Movie쓰면 모듈 에러나지?
        return this.moviesService.getOne(movieId)
    }

    @Post()
    create(@Body() movieData: CreateMovieDto) {

        return this.moviesService.create(movieData)
    }

    @Delete(":id")
    remove(@Param("id") movieId: number) {
        return this.moviesService.deleteOne(movieId)
    }

    @Patch(":id")
    patch(@Param("id") movieId: number, @Body() updateData: UpdateMovieDto) {
        return this.moviesService.update(movieId, updateData)
    }

}
