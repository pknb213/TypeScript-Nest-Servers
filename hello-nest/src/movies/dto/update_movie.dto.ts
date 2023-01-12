import {IsNumber, IsString} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";
import {CreateMovieDto} from "./create_movie.dto";

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
}

//     @IsString()
//     readonly title?: string
//     @IsNumber()
//     readonly year?: number
//     @IsString({each: true})
//     readonly genres?: string[]
// }