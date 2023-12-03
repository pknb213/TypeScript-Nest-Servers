import {UserEntity} from "../entities/user.entity";
import {PickType} from "@nestjs/mapped-types";
import {CommonOutputType} from "../../common/dtos/common-output.dto";

export class SignUpInputType extends PickType(UserEntity, [
    'email',
    'password',
    'role',
]) {

}

export class SignUpOutputType extends CommonOutputType{

}