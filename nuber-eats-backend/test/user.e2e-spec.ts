import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {DataSource, getConnection, Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../src/users/entities/user.entity";

jest.mock('got', () => {
    return {
        post: jest.fn()
    }
})

const GRAPHQL_ENDPOINT = '/graphql'
const testUser = {
    EMAIL: 'yj@naver.com',
    PASSWORD: '1234'
}
describe('AppController (e2e)', () => {
    let app: INestApplication;
    let userRepository: Repository<User>
    let jwtToken: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        await app.init();
    });

    afterAll(async () => {
        const dataSource = new DataSource({
            type: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'developer',
            password: 'devpassword',
            database: 'nuber-eats-test',
        });
        const connection = await dataSource.initialize();
        await connection.dropDatabase();
        await connection.destroy();
        await app.close()
    })

    describe('createAccount', () => {
        it('should create account', async function () {
            return request(app.getHttpServer())
                .post(GRAPHQL_ENDPOINT)
                .send({
                    query: `
            mutation {
              createAccount(input: {
                email: "${testUser.EMAIL}",
                password: "${testUser.PASSWORD}",
                role: Owner
              }) {
                ok
                error
              }
            }
            `,
                })
                .expect(200)
                .expect(res => {
                    expect(res.body.data.createAccount.ok).toBe(true)
                    expect(res.body.data.createAccount.error).toBe(null)
                })
        });
        it('should fail if account already exists', function () {
            return request(app.getHttpServer())
                .post(GRAPHQL_ENDPOINT)
                .send({
                    query: `
            mutation {
              createAccount(input: {
                email: "${testUser.EMAIL}",
                password: "${testUser.PASSWORD}",
                role: Owner
              }) {
                ok
                error
              }
            }
            `,
                })
                .expect(200)
                .expect(res => {
                    expect(res.body.data.createAccount.ok).toBe(false)
                    expect(res.body.data.createAccount.error).toBe("There is User with that email already")
                })
        });
    })

    describe('login', () => {
        it('should login with correct credentials', () => {
            return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
                query: `
          mutation {
            login(input: {
              email: "${testUser.EMAIL}",
              password: "${testUser.PASSWORD}"
            }) {
              ok
              error
              token
            }
          }
          `,
            })
                .expect(200)
                .expect(res => {
                    const {
                        body: {
                            data: {login},
                        }
                    } = res
                    expect(login.ok).toBe(true)
                    expect(login.error).toBe(null)
                    expect(login.token).toEqual(expect.any(String))
                    jwtToken = login.token
                })
        })
        it('should not be able to login with wrong credentials', function () {
            return request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({
                query: `
          mutation {
            login(input: {
              email: "${testUser.EMAIL}",
              password: "${testUser.PASSWORD}+121212"
            }) {
              ok
              error
              token
            }
          }
          `,
            })
                .expect(200)
                .expect(res => {
                    const {
                        body: {
                            data: {login},
                        }
                    } = res
                    expect(login.ok).toBe(false)
                    expect(login.error).toBe("Wrong Password")
                    expect(login.token).toBe(null)
                })
        });
    })
    describe("userProfile", () => {
        let userId: number
        beforeAll(async () => {
            const [user] = await userRepository.find()
            userId = user.id
        })
        it("should see a user's profile", function () {
            return request(app.getHttpServer())
                .post(GRAPHQL_ENDPOINT)
                .set('X-JWT', jwtToken)
                .send({
                    query: `
                {
                    userProfile(userId: ${userId}){
                    ok
                    error
                    user {
                        id
                    }
                  }
                }`
                })
                .expect(200)
                .expect(res => {
                    const {
                        body: {
                            data: {
                                userProfile: {
                                    ok,
                                    error,
                                    user: {id}
                                }
                            }
                        }
                    } = res
                    expect(ok).toBe(true)
                    expect(error).toBe(null)
                    expect(id).toBe(userId)
                })
        });
        it("should not find a profile", function () {
            return request(app.getHttpServer())
                .post(GRAPHQL_ENDPOINT)
                .set('X-JWT', jwtToken)
                .send({
                    query: `
                {
                    userProfile(userId: 77){
                    ok
                    error
                    user {
                        id
                    }
                  }
                }`
                })
                .expect(200)
                .expect(res => {
                    console.log(res.body)
                    const {
                        body: {
                            data: {
                                userProfile: {
                                    ok,
                                    error,
                                    user
                                }
                            }
                        }
                    } = res
                    expect(ok).toBe(false)
                    expect(error).toBe('User Not Found')
                    expect(user).toBe(null)
                })
        });
    })
    describe('me', () => {
        it('should find my profile', function () {
            return request(app.getHttpServer())
                .post(GRAPHQL_ENDPOINT)
                .set('X-JWT', jwtToken)
                .send({
                    query: `
                    {
                        me {
                            email
                        }
                    }
                    `
                })
                .expect(200)
                .expect(res => {
                    console.log(res.body)
                    const {body: { data: { me: { email } } } } = res
                    expect(email).toBe(testUser.EMAIL)
                })
        });
        it('should not allow logged out user', function () {
            return request(app.getHttpServer())
                .post(GRAPHQL_ENDPOINT)
                .send({
                    query: `
                    {
                        me {
                            email
                        }
                    }
                    `
                })
                .expect(200)
                .expect(res => {
                    console.log(res.body)
                    const {body: { errors } } = res;
                    const [error] = errors
                    console.log(error)
                    expect(error.message).toBe('Forbidden resource')
                })
        });
    })

    it.todo('verifyEmail')
    it.todo('editProfile')

});
