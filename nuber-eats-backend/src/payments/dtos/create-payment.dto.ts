import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Payment } from "../entities/payment.entity";
import { CoreEntity } from "../../common/entities/core.entity";

@InputType()
export class CreatePaymentInput extends PickType(
  Payment, [
    "transactionId", "restaurantId"
  ]) {
}
@ObjectType()
export class CreatePaymentOutput extends CoreEntity {

}