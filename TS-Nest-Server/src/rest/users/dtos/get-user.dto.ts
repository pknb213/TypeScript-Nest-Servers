import {CommonOutput} from "../../common/dtos/common-output.dto";
import {UserEntity} from "../entities/user.entity";

export class GetUserOutput extends CommonOutput{
    user?: UserEntity
}

export class GetAllUsersOutput {

}