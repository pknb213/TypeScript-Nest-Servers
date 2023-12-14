import {CommonOutputType} from "../../common/dtos/common-output.dto";
import {UserEntity} from "../entities/user.entity";

export class GetUserOutputType extends CommonOutputType{
    user?: UserEntity
}

export class GetAllUsersOutputType {

}