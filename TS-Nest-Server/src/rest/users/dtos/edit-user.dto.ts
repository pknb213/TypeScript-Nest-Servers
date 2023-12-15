import {CommonOutputType} from "../../common/dtos/common-output.dto";
import {CommonInputType} from "../../common/dtos/common-input.dto";
import {PickType} from "@nestjs/mapped-types";
import {UserEntity} from "../entities/user.entity";

export class EditUserInputType extends PickType(UserEntity, [
    "name",
    "email",
    "password",
    "age",
    "gender",
    "address"
]) {}

export class EditUserOutputType extends CommonOutputType {

}
