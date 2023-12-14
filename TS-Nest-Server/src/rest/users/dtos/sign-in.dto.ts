import {CommonOutputType} from "../../common/dtos/common-output.dto";
import {PickType} from "@nestjs/mapped-types";
import {UserEntity} from "../entities/user.entity";

export class SignInInputType extends PickType(
    UserEntity,
    ["email","password"]
){}

export class SignInOutputType extends CommonOutputType{
    token?: string
}