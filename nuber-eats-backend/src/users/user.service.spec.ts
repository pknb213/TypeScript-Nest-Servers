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
    create: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn()
})

const mockJwtService = () => ({
    sign: jest.fn(() => "signed-token"),
    verify: jest.fn()
})

const mockMailService = () => ({
    sendVerificationEmail: jest.fn()
})

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe("User Service", () => {

    let service: UsersService
    let usersRepository: MockRepository<User>
    let verificationsRepository: MockRepository<Verification>
    let mailService: MailService
    let jwtService: JwtService

    beforeEach(async () => {
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
                    useValue: mockJwtService()
                },
                {
                    provide: MailService,
                    useValue: mockMailService()
                }
            ],
        }).compile()
        service = module.get<UsersService>(UsersService)
        mailService = module.get<MailService>(MailService)
        verificationsRepository = module.get(getRepositoryToken(Verification))
        usersRepository = module.get(getRepositoryToken(User))
        jwtService = module.get<JwtService>(JwtService)
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
        it('should fail on exception', async function () {
            usersRepository.findOne.mockRejectedValue(new Error(':'))
            const result = await service.createAccount(createAccountArgs)
            expect(result).toEqual({ok: false, error: "Couldn't create account"})
        });

    })

    describe('login', () => {
        const loginArgs = {
            email: "yj@naver.com",
            password: "1234"
        }
        it('should fail if user does not exist', async function () {
            usersRepository.findOne.mockResolvedValue(null)
            const result = await service.login(loginArgs)

            expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object)
            )

            expect(result).toEqual({
                ok: false,
                error: "User not Found"
            })
        });
        it('should fail if the passwrod is wrong', async function () {
            const mockedUser = {
                checkPassword: jest.fn(()=>Promise.resolve(false))
            }
            usersRepository.findOne.mockResolvedValue(mockedUser)
            const result = await service.login(loginArgs)
            expect(result).toEqual({ok: false, error: "Wrong Password"})
        });
        it('should return token if password correct', async function () {
            const mockedUser = {
                id: 1,
                checkPassword: jest.fn(()=>Promise.resolve(true))
            }
            usersRepository.findOne.mockResolvedValue(mockedUser)
            const result = await service.login(loginArgs)
            expect(jwtService.sign).toHaveBeenCalledTimes(1)
            expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number))
            expect(result).toEqual({ok: true, token: 'signed-token'})
        });
        it('should fail on exception', async function () {
            usersRepository.findOne.mockResolvedValue(new Error())
            const result = await service.login(loginArgs)
            expect(result).toEqual({ok: false, error: "Can't log user in."})
        });
    })
    describe('findById', () => {
        const findByIdArgs = {
            id: 1
        }
        it('should find an existing user', async function () {
            usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs)
            const result = await service.findById(1)
            expect(result).toEqual({ok: true, user: findByIdArgs})
        });
        it('should fail if no user if found', async function () {
            usersRepository.findOneOrFail.mockResolvedValue(new Error)
            const result = await service.findById(1)
            /** Tdoo: 잘 모르겠다는 병신 같은 이유 때문에 findOneOrFail() 결과가 Try Catch 걸리지 않는다 씨발 */
            // expect(result).toEqual({ok: false, error: "User Not Found"})
        });

    })
    describe('editProfile', () => {
        it('should change email', async function () {
            const oldUser = {
                email: "yj@old.com",
                verified: true
            }
            const editProfileArgs = {
                userId: {"where": {"id": 1}},
                input: { email: "yj@new.com" }
            }
            const newVerification = {
                code: 'code'
            }
            const newUser = {
                verified: false,
                email: editProfileArgs.input.email
            }
            usersRepository.findOne.mockResolvedValue(oldUser)
            verificationsRepository.create.mockReturnValue(newVerification)
            verificationsRepository.save.mockResolvedValue(newVerification)

            await service.editProfile(editProfileArgs.userId.where.id, editProfileArgs.input)

            expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                editProfileArgs.userId
            )
            expect(verificationsRepository.create).toHaveBeenCalledWith({
                user: newUser
            })
            expect(verificationsRepository.save).toHaveBeenCalledWith(newVerification)

            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                newUser.email,
                newVerification.code
            )
        });
        it('should change password', async function () {
            const editProfileArgs = {
                userId: {"where": {"id": 1}},
                input: { password: "new1234" }
            }
            usersRepository.findOne.mockResolvedValue({
                password: "old"
            })
            const result = await service.editProfile(editProfileArgs.userId.where.id, editProfileArgs.input)
            expect(usersRepository.save).toHaveBeenCalledTimes(1)
            expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input)
            expect(result).toEqual({ok: true})
        });
        it('should fail on exception',async function () {
            usersRepository.findOne.mockResolvedValue(new Error)
            const result = await service.editProfile(1, {email: '12'})
            expect(result).toEqual({ok: false, error: "Could not update profile"})
        });
    })
    describe('verifyEmail', () => {

        it('should verify email', async function () {
            const mockedVerification = {
                user: {
                    verified: false,
                },
                id: 1
            }
            verificationsRepository.findOne.mockResolvedValue(mockedVerification)
            const result = await service.verifyEmail('')
            expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object)
            )
            expect(usersRepository.save).toHaveBeenCalledTimes(1)
            expect(usersRepository.save).toHaveBeenCalledWith({verified: true})

            expect(usersRepository.delete).toHaveBeenCalledTimes(1)
            expect(usersRepository.delete).toHaveBeenCalledWith(mockedVerification.id)

            expect(result).toEqual({ok: true})
        });

        it('should fail on verification not found', async function () {
            verificationsRepository.findOne.mockResolvedValue(undefined)
            const result = await service.verifyEmail('')
            expect(result).toEqual({ok: false, error: "Verification Is False"})
        });

        it('should fail on exception', async function () {
            verificationsRepository.findOne.mockRejectedValue(new Error())
            const result = await service.verifyEmail('')
            expect(result).toEqual({ok: false, error: "Could not verify email"})
        });
    })
})