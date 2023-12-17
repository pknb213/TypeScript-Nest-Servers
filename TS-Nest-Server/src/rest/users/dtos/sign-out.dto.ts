import {CommonOutput} from "../../common/dtos/common-output.dto";
import {PickType} from "@nestjs/mapped-types";
import {UserEntity} from "../entities/user.entity";

export class SignOutInput extends PickType(UserEntity, ["id"])
{}

export class SignOutOutput extends CommonOutput {

}