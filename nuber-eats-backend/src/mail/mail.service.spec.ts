import {MailService} from "./mail.service";
import {Test} from "@nestjs/testing";
import got from "got";
import {CONFIG_OPTIONS} from "../common/common.constants";
import * as FormData from "form-data";

jest.mock('got')
jest.mock('form-data')

const TEST_DOMAIN = "test-domain"
describe('MailService', () => {
    let service: MailService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MailService,
                {
                    provide: CONFIG_OPTIONS,
                    useValue: {
                        apiKey: 'test-apiKey',
                        domain: TEST_DOMAIN,
                        'fromEmail': 'test-fromEmail'
                    }
                }
            ],
        }).compile()
        service = module.get<MailService>(MailService)
    })

    it('should be defined', function () {
        expect(service).toBeDefined()
    });
    describe('sendVerificationEmail', () => {
        it('should call sendEmail', function () {
            const sendVerificationEmailArgs = {
                email: 'email',
                code: 'code,'
            }
            jest.spyOn(service, 'sendEmail').mockImplementation(async () =>  true)
            service.sendVerificationEmail(
                sendVerificationEmailArgs.email,
                sendVerificationEmailArgs.code
            )
            expect(service.sendEmail).toHaveBeenCalledTimes(1)
            expect(service.sendEmail).toHaveBeenLastCalledWith(
                "Verify Your Email",
                "verify-email", [
                    {key: 'code', value: sendVerificationEmailArgs.code},
                    {key: 'username', value: sendVerificationEmailArgs.email}
            ])
        });
    })
    describe('sendEmail', () => {
        it('sends email', async function () {
            const ok = await service.sendEmail('', '', [])
            const formSpy = jest.spyOn(FormData.prototype, 'append')
            expect(formSpy).toHaveBeenCalled()
            expect(got.post).toHaveBeenCalledTimes(1)
            expect(got.post).toHaveBeenLastCalledWith(
                `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
                expect.any(Object))
            expect(ok).toEqual(true)
        });
        it('fails on error', async function () {
            jest.spyOn(got, 'post').mockImplementation(()=> {
                throw new Error()
            })
            const ok = await service.sendEmail('','',[])
            expect(ok).toEqual(false)
        });
        it('sends email', async () => {
            const ok = await service.sendEmail('', '', [
                { key: 'attr', value: 'attrValue' },
            ]);
            const formSpy = jest.spyOn(FormData.prototype, 'append');

            expect(formSpy).toHaveBeenCalled()
        });
    })
})
