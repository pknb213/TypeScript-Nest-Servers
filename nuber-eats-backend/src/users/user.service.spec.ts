import {UsersService} from "./user.service";
import {Verification} from "./entities/verfication.entity";
import {JwtService} from "../jwt/jwt.service";
import {MailService} from "../mail/mail.service";
import {User} from "./entities/user.entity";
import { Test } from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from "typeorm";

const mockRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn()
})

const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn()
}

const mockMailService = {
    sendVerificationEmail: jest.fn()
}

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe("User Service", () => {

    let service: UsersService
    let usersRepository: MockRepository<User>
    let verificationsRepository: MockRepository<Verification>
    let mailService: MailService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository()
                },
                {
                    provide: getRepositoryToken(Verification),
                    useValue: mockRepository()
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: MailService,
                    useValue: mockMailService
                }
            ],
        }).compile()
        service = module.get<UsersService>(UsersService)
        mailService = module.get<MailService>(MailService)
        verificationsRepository = module.get(getRepositoryToken(Verification))
        usersRepository = module.get(getRepositoryToken(User))
    })

    it('should be defined', function () {
        expect(service).toBeDefined()
    });

    describe("create Account", () => {
        const createAccountArgs = {
                email: '',
                password: '',
                role: 0
            }
        it('should fail if user exists', async function () {
            usersRepository.findOne.mockResolvedValue({
                id: 1,
                email: "mock@naver.com"
            })
            const result = await service.createAccount(createAccountArgs)
            expect(result).toMatchObject({
                ok: false,
                error: "There is User with that email already"
            })
        });
        it('should create a new user', async function () {
            usersRepository.findOne.mockResolvedValue(undefined)
            usersRepository.create.mockReturnValue(createAccountArgs)
            usersRepository.save.mockResolvedValue(createAccountArgs)
            verificationsRepository.create.mockReturnValue({
                user: createAccountArgs
            })
            verificationsRepository.save.mockResolvedValue({
                code: 'code'
            })

            const result = await service.createAccount(createAccountArgs)
            expect(usersRepository.create).toHaveBeenCalledTimes(1)
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs)
            expect(usersRepository.save).toHaveBeenCalledTimes(1)
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs)
            expect(verificationsRepository.create).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.create).toHaveBeenCalledWith({
                user: createAccountArgs
            })
            expect(verificationsRepository.save).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.save).toHaveBeenCalledWith({
                user: createAccountArgs
            })
            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1)
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String)
            )
            expect(result).toEqual({ok: true})
        });
    })
    // })
    // it.todo('login', () => {
    //
    // })
    // it.todo('findById', () => {
    //
    // })
    // it.todo('editProfile', () => {
    //
    // })
    // it.todo('verifyEmail', () => {
    //
    // })
})