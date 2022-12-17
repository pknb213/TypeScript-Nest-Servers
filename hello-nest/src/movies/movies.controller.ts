import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import * as querystring from "querystring";
import { Movie } from 'src/entitys/movie.entity';
import {MoviesService} from "./movies.service";

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    getAll(): Movie[] {
        return this.moviesService.getAll()
    }

    @Get("search")
    search(@Query("year") searchYear: string){
        return searchYear
    }

    @Get(":id")
    getOne(@Param("id") movieId: string): Movie {
        return this.moviesService.getOne(movieId)
    }

    @Post()
    create(@Body() movieData) {
        return this.moviesService.create(movieData)
    }

    @Delete(":id")
    remove(@Param("id") movieId: string) {
        return this.moviesService.deleteOne(movieId)
    }

    @Patch(":id")
    patch(@Param("id") movieId: string, @Body() updateData) {
        return this.moviesService.update(movieId, updateData)
    }

}
