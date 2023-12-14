import {CommonOutputType} from "../../common/dtos/common-output.dto";
import {PickType} from "@nestjs/mapped-types";
import {UserEntity} from "../entities/user.entity";

export class SignOutInputType extends PickType(UserEntity, ["id"])
{}

export class SignOutOutputType extends CommonOutputType{

}