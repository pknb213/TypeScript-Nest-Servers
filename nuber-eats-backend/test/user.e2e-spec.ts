import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {getConnection} from "typeorm";

const GRAPHQL_ENDPOINT = '/graphql'
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  /**
   * const dataSource = new DataSource({
   * type: 'postgres',
   * host: 'localhost',
   * port: 5432,
   * username: 'geony',
   * password: '1234',
   * database: 'kuber-test',
   * });
   * const connection = await dataSource.initialize();
   * await connection.dropDatabase();
   * await connection.destroy();
   * await app.close();
   */
  
  afterAll(async () => {
    await getConnection().dropDatabase()
    await app.close()
  })

  describe('createAccount', () => {
    const EMAIL = 'yj@naver.com'
    it('should create account', async function () {
      return request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .send({
            query: `
            mutation {
              createAccount(input: {
                email: "${EMAIL}",
                password: "12345",
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
            expect(res.body.data.createAccount.error).toBe(false)
          })
    });
    it('should fail if account already exists', function () {
      
    });
  })
  it.todo('createAccount')
  it.todo('userProfile')
  it.todo('login')
  it.todo('me')
  it.todo('verifyEmail')
  it.todo('editProfile')

});
