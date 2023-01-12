import {Injectable, NotFoundException} from '@nestjs/common';
import {Movie} from "./entitys/movie.entity";
import {CreateMovieDto} from "./dto/create_movie.dto";
import {UpdateMovieDto} from "./dto/update_movie.dto";

@Injectable()
export class MoviesService {
    private movies: Movie[] = []

    getAll(): Movie[] {
        return this.movies
    }

    getOne(id: number): Movie {
        // return this.movies.find(movie => movie.id === +id);
        const movie = this.movies.find(movie => movie.id === id)
        if (!movie) throw new NotFoundException("Movie with Id: " + id);
        return movie
    }

    deleteOne(id: number) {
        this.getOne(id)
        this.movies = this.movies.filter(movie => movie.id !== +id)
    }

    create(moviesData: CreateMovieDto) {
        this.movies.push({
            id: this.movies.length + 1,
            ...moviesData
        })
    }

    update(id: number, updateData: UpdateMovieDto) {
        const movie = this.getOne(id)
        this.deleteOne(id)
        this.movies.push({...movie, ...updateData})
    }
}
