import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
    @Get()
    getAll() {
        return "This will return al movies"
    }

    @Get("/:id")
    getOne(@Param("id") movieId: string) {
        return "This is return OneMMovies with the Id: " + movieId
    }

    @Post()
    create() {
        return "This is Create a movie"
    }

    @Delete("/:id")
    remove(@Param("id") movieId: string) {
        return "This will delete a moview wth id: " + movieId
    }

    @Patch("/:id")
    patch(@Param("id") movieId: string) {
        return "This is update moview with id: " + movieId
    }
}
