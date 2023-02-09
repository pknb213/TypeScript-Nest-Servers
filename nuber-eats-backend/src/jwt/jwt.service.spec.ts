import {JwtService} from "./jwt.service";
import * as jwt from "jsonwebtoken"
import {Test} from "@nestjs/testing";
import {CONFIG_OPTIONS} from "../common/common.constants";

const TEST_KEY = 'testKey'
const TOKEN = "TOKEN"
const USER_ID = 1

jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn(() => "TOKEN"),
        verify: jest.fn(()=> ({id: USER_ID}))
    }
})

describe('JewService', () => {
    let service: JwtService
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [JwtService, {
                provide: CONFIG_OPTIONS,
                useValue: {privateKey: TEST_KEY},
            }]
        }).compile()
        service = module.get<JwtService>(JwtService)
    })
    it('should be defined', function () {
        expect(service).toBeDefined()
    });
    describe('sign', () => {
        it('should return a signed token', function () {
            service.sign(USER_ID)
            expect(jwt.sign).toHaveBeenCalledTimes(1)
            expect(jwt.sign).toHaveBeenLastCalledWith({id: USER_ID}, TEST_KEY)
        });
    })
    describe('verify', () => {
        it('should return the decoded token', function () {
            const decodedToken = service.verify(TOKEN)
            expect(decodedToken).toEqual({id: USER_ID})
            expect(jwt.verify).toHaveBeenCalledTimes(1)
            expect(jwt.verify).toHaveBeenLastCalledWith(TOKEN, TEST_KEY)
        });
    })
})