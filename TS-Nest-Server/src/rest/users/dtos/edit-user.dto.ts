import {CommonOutput} from "../../common/dtos/common-output.dto";
import {CommonInput} from "../../common/dtos/common-input.dto";
import {PickType} from "@nestjs/mapped-types";
import {UserEntity} from "../entities/user.entity";

export class EditUserInput extends PickType(UserEntity, [
    "name",
    "email",
    "password",
    "age",
    "gender",
    "address"
]) {}

export class EditUserOutput extends CommonOutput {

}
