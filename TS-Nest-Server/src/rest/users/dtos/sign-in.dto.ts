import {CommonOutput} from "../../common/dtos/common-output.dto";
import {PickType} from "@nestjs/mapped-types";
import {UserEntity} from "../entities/user.entity";

export class SignInInput extends PickType(
    UserEntity,
    ["email","password"]
){}

export class SignInOutput extends CommonOutput{
    token?: string
}