import {Query, Resolver} from '@nestjs/graphql';
import {DomainService} from "./domain.service";

@Resolver()
export class DomainResolver {
    constructor(private readonly domainService: DomainService) {}

    @Query(returns => String)
    helloWorld() {
        return `Graphql!! Hello World!`
    }
}
