import request from 'supertest'
import App from '../src/app'
import {before} from "node:test";

beforeAll(async () => {

})
afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
})
// describe('Test the root path', () => {
//   test('It should response the GET method', async (done) => {
//     // Route
//     const response = await request(App.app).get('/')
//     expect(response.statusCode).toBe(200)
//     done()
//   })
// })
describe('Test /', () => {
    test('Should return 200', async () => {
        const res = await request(App.app).get('/')
        expect(res.statusCode).toBe(200)
    })
})

describe('GET /', () => {
    it('should return 200 & valid response if request param list is empity', done => {
        request(App.app)
            .get(`/`)
            .expect('Content-Type', /text/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.statusCode).toBe(200)
                // expect(res.body).toMatchObject({'message': 'Hello, stranger!'})
                done()
            })
    })
})