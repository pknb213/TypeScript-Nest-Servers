import {UserEntity} from "../entities/user.entity";
import {PickType, PartialType} from "@nestjs/mapped-types";
import {CommonOutputType} from "../../common/dtos/common-output.dto";

export class SignUpInputType extends PickType(PartialType(UserEntity), [
    'email',
    'password',
    'role',
]) {

}

export class SignUpOutputType extends CommonOutputType{

}