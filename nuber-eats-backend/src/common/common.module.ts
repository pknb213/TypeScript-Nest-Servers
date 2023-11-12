import { Global, Module } from "@nestjs/common";
import { PUB_SUB } from "./common.constants";
import { PubSub } from "graphql-subscriptions";

const pub_sub = new PubSub()

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pub_sub,
    }
  ],
  exports: [PUB_SUB]
})
export class CommonModule {}
