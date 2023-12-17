import {UserEntity} from "../entities/user.entity";
import {PickType, PartialType} from "@nestjs/mapped-types";
import {CommonOutput} from "../../common/dtos/common-output.dto";

export class SignUpInput extends PickType(PartialType(UserEntity), [
    'email',
    'password',
    'role',
]) {

}

export class SignUpOutput extends CommonOutput{

}