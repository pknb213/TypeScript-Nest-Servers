// import * as request from 'supertest';
// import { Test } from '@nestjs/testing';
// import { AppModule } from './../src/app.module';
// import { INestApplication } from '@nestjs/common';
// import { Any, Repository } from 'typeorm';
// import { Podcast } from 'src/podcast/entities/podcast.entity';
// import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
// import { Episode } from 'src/podcast/entities/episode.entity';
// import { User } from 'src/users/entities/user.entity';
// describe('App (e2e)', () => {
//   let app: INestApplication;
//   let podcastRepo: Repository<Podcast>;
//   let episodeRepo: Repository<Episode>;
//   let userRepo: Repository<User>;
//   let jwtToken: string;
//
//   const testUser = {
//     EMAIL: 'yj@naver.com',
//     PASSWORD: '1234',
//   };
//   const GRAPHQL_ENDPOINT = '/graphql';
//   const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
//   const publicTest = (query: string) => baseTest().send({ query });
//   const privateTest = (query: string) =>
//       baseTest().set('X-JWT', jwtToken).send({ query });
//
//   beforeAll(async () => {
//     const moduleFixture = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     podcastRepo = moduleFixture.get<Repository<Podcast>>(
//         getRepositoryToken(Podcast),
//     );
//     episodeRepo = moduleFixture.get<Repository<Episode>>(
//         getRepositoryToken(Episode),
//     );
//     userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
//     await app.init();
//   });
//
//   afterAll(async () => {
//     await app.close();
//   });
//
//   describe('Users Resolver', () => {
//     describe('createAccount', () => {
//       it('should create account', () => {
//         return publicTest(`
//         mutation {
//           createAccount(input: {
//             email: "${testUser.EMAIL}",
//             password: "${testUser.PASSWORD}",
//             role: Host
//           }) {
//             ok
//             error
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               expect(res.body.data.createAccount.ok).toBe(true);
//               expect(res.body.data.createAccount.error).toBe(null);
//             });
//       });
//       it('should fail if account already exists', function () {
//         return publicTest(`
//         mutation {
//           createAccount(input: {
//             email: "${testUser.EMAIL}",
//             password: "${testUser.PASSWORD}",
//             role: Host
//           }) {
//             ok
//             error
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               expect(res.body.data.createAccount.ok).toBe(false);
//               expect(res.body.data.createAccount.error).toBe(
//                   `There is a user with that email already`,
//               );
//             });
//       });
//     });
//
//     describe('login', () => {
//       it('should login with correct credentials', () => {
//         return publicTest(`
//         mutation {
//           login(input: {
//             email: "${testUser.EMAIL}",
//             password: "${testUser.PASSWORD}"
//           }) {
//             ok
//             error
//             token
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: { login },
//                 },
//               } = res;
//               expect(login.ok).toBe(true);
//               expect(login.error).toBe(null);
//               expect(login.token).toEqual(expect.any(String));
//               jwtToken = login.token;
//             });
//       });
//       it('should not be able to login with wrong credentials', () => {
//         return publicTest(`
//         mutation {
//           login(input: {
//             email: "${testUser.EMAIL}",
//             password: "${testUser.PASSWORD}+121212"
//           }) {
//             ok
//             error
//             token
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: { login },
//                 },
//               } = res;
//               expect(login.ok).toBe(false);
//               expect(login.error).toBe('Wrong password');
//               expect(login.token).toBe(null);
//             });
//       });
//     });
//
//     describe('seeProfile', () => {
//       let userId: number;
//       beforeAll(async () => {
//         const [user] = await userRepo.find();
//         userId = user.id;
//       });
//       it("should see a user's profile", () => {
//         return privateTest(`
//         {
//             seeProfile(userId: ${userId}){
//             ok
//             error
//             user {
//                 id
//             }
//           }
//         }`)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     seeProfile: {
//                       ok,
//                       error,
//                       user: { id },
//                     },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBe(null);
//               expect(id).toBe(userId);
//             });
//       });
//       it('should not find a profile', () => {
//         return privateTest(`
//         {
//             seeProfile(userId: 77){
//             ok
//             error
//             user {
//                 id
//             }
//           }
//         }`)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     seeProfile: { ok, error, user },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(false);
//               expect(error).toBe('User Not Found');
//               expect(user).toBe(null);
//             });
//       });
//     });
//
//     describe('me', () => {
//       it('should find my profile', () => {
//         return privateTest(`
//         {
//             me {
//                 email
//             }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     me: { email },
//                   },
//                 },
//               } = res;
//               expect(email).toBe(testUser.EMAIL);
//             });
//       });
//       it('should not allow logged out user', () => {
//         return publicTest(`
//         {
//             me {
//                 email
//             }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: { errors },
//               } = res;
//               const [error] = errors;
//               expect(error.message).toBe('Forbidden resource');
//             });
//       });
//     });
//
//     describe('editProfile', () => {
//       const NEW_EMAIL = 'yj@gmail.com';
//       it('should change email', () => {
//         return privateTest(`
//         mutation {
//             editProfile(input: {
//                 email: "${NEW_EMAIL}"
//             }) {
//                 ok
//                 error
//             }
//         }`)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     editProfile: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBe(null);
//             });
//       });
//       it('should have new email', () => {
//         return privateTest(`
//         {
//             me {
//                 email
//             }
//         }`)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     me: { email },
//                   },
//                 },
//               } = res;
//               expect(email).toBe(NEW_EMAIL);
//             });
//       });
//     });
//   });
//
//   describe('Podcasts Resolver', () => {
//     const testPodcast = {
//       TITLE: 'Happy Virus',
//       CATEGORY: 'LIFE',
//     };
//     const wrongPodcast = {
//       TITLE: 123,
//       CATEGORY: 456,
//     };
//     describe('createPodcast', () => {
//       it('should create podcast', () => {
//         return privateTest(`
//         mutation {
//           createPodcast(input: {
//             title: "${testPodcast.TITLE}"
//             category: "${testPodcast.CATEGORY}"
//           }) {
//           ok
//           error
//           id
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     createPodcast: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBe(null);
//             });
//       });
//       it('should be bad request if graphql validation fail', () => {
//         return privateTest(`
//         mutation {
//           createPodcast(input: {
//             title: ${wrongPodcast.TITLE}
//             category: ${wrongPodcast.CATEGORY}
//           }) {
//             ok
//             error
//             id
//           }
//         }
//         `)
//             .expect(400)
//             .expect(res => {
//               const {
//                 body: {
//                   errors: [
//                     {
//                       message: message1,
//                       extensions: { code: extensions1 },
//                     },
//                     {
//                       message: message2,
//                       extensions: { code: extensions2 },
//                     },
//                   ],
//                 },
//               } = res;
//               expect(message1).toBe(
//                   'String cannot represent a non string value: 123',
//               );
//               expect(extensions1).toBe('GRAPHQL_VALIDATION_FAILED');
//               expect(message2).toBe(
//                   'String cannot represent a non string value: 456',
//               );
//               expect(extensions2).toBe('GRAPHQL_VALIDATION_FAILED');
//             });
//       });
//     });
//     describe('getAllPodcasts', () => {
//       it('should get all podcasts', () => {
//         return publicTest(`
//         {
//           getAllPodcasts{
//             ok
//             error
//             podcasts {
//               id
//               title
//               category
//               rating
//               createdAt
//               updatedAt
//             }
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     getAllPodcasts: { ok, error, podcasts },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//               expect(podcasts).toBeInstanceOf(Array);
//               expect(podcasts).toHaveLength(1);
//               expect(podcasts[0]).toHaveProperty('title', testPodcast.TITLE);
//               expect(podcasts[0]).toHaveProperty(
//                   'category',
//                   testPodcast.CATEGORY,
//               );
//             });
//       });
//     });
//     describe('getPodcast', () => {
//       const PODCAST_ID = 1;
//       it('should get only one podcast', () => {
//         return publicTest(`
//         {
//           getPodcast (input: {
//             id: ${PODCAST_ID}
//           }) {
//             ok
//             error
//             podcast {
//               id
//               title
//               category
//               rating
//               episodes {
//                 id
//                 title
//                 category
//               }
//             }
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     getPodcast: { ok, error, podcast },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//               expect(podcast).toBeInstanceOf(Object);
//               expect(podcast).toHaveProperty('title', testPodcast.TITLE);
//               expect(podcast).toHaveProperty('category', testPodcast.CATEGORY);
//             });
//       });
//       const WRONG_PODCAST_ID = 111;
//       it('should fail if podcast id is wrong', () => {
//         return publicTest(`
//         {
//           getPodcast (input: {
//             id: ${WRONG_PODCAST_ID}
//           }) {
//             ok
//             error
//             podcast {
//               id
//               title
//               category
//               rating
//               episodes {
//                 id
//                 title
//                 category
//               }
//             }
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     getPodcast: { ok, error, podcast },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(false);
//               expect(error).toBe(`Podcast with id ${WRONG_PODCAST_ID} not found`);
//               expect(podcast).toBeNull();
//             });
//       });
//     });
//     describe('updatePodcast', () => {
//       const PODCAST_ID = 1;
//       const newPodcast = {
//         NEW_TITLE: 'new title',
//         NEW_CATEGORY: 'new category',
//         NEW_RATING: 1,
//       };
//       it('should update podcast', () => {
//         return publicTest(`
//         mutation {
//           updatePodcast(input: {
//             id: ${PODCAST_ID}
//             payload: {
//               title: "${newPodcast.NEW_TITLE}"
//               category: "${newPodcast.NEW_CATEGORY}"
//               rating: ${newPodcast.NEW_RATING}
//             }
//           }) {
//             ok
//             error
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     updatePodcast: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//             });
//       });
//       const WRONG_PODCAST_ID = 111;
//       it('should fail if podcast id is wrong', () => {
//         return publicTest(`
//         mutation {
//           updatePodcast(input: {
//             id: ${WRONG_PODCAST_ID}
//             payload: {
//               title: "${newPodcast.NEW_TITLE}"
//               category: "${newPodcast.NEW_CATEGORY}"
//               rating: ${newPodcast.NEW_RATING}
//             }
//           }) {
//             ok
//             error
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     updatePodcast: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(false);
//               expect(error).toBe(`Podcast with id ${WRONG_PODCAST_ID} not found`);
//             });
//       });
//       const OVER_RATING = 100;
//       it('should fail if rating range is over', () => {
//         return publicTest(`
//         mutation {
//           updatePodcast(input: {
//             id: ${PODCAST_ID}
//             payload: {
//               title: "${newPodcast.NEW_TITLE}"
//               category: "${newPodcast.NEW_CATEGORY}"
//               rating: ${OVER_RATING}
//             }
//           }) {
//             ok
//             error
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     updatePodcast: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(false);
//               expect(error).toBe('Rating must be between 1 and 5.');
//             });
//       });
//     });
//     describe('deletePodcast', () => {
//       const DELETE_PODCAST_ID = 1;
//       it('should delete podcast', () => {
//         return publicTest(`
//         mutation{
//           deletePodcast (input: {
//             id: ${DELETE_PODCAST_ID}
//           }) {
//             error
//             ok
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     deletePodcast: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//             });
//       });
//       const WRONG_PODCAST_ID = 111;
//       it('should fail if podcast id is wrong', () => {
//         return publicTest(`
//         mutation{
//           deletePodcast (input: {
//             id: ${WRONG_PODCAST_ID}
//           }) {
//             error
//             ok
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     deletePodcast: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(false);
//               expect(error).toBe(`Podcast with id ${WRONG_PODCAST_ID} not found`);
//             });
//       });
//     });
//   });
//   describe('Episode Resolver', () => {
//     // Todo: 위에서 Podcast를 삭제했으니 다시 만들고 거기에 에피를 넣어야 함.
//     let podcastId: number;
//     const EPISODE_ID = 1;
//     beforeAll(async () => {
//       await podcastRepo.save(
//           await podcastRepo.create({
//             title: 'New Podcast',
//             category: 'New Category',
//           }),
//       );
//       const [podcast] = await podcastRepo.find();
//       podcastId = podcast.id;
//     });
//     const newEpisode = {
//       EPISODE_TITLE: 'New Episode',
//       EPISODE_CATEGORY: 'Animation',
//     };
//     describe('createEpisode', () => {
//       it('should create episode', () => {
//         return publicTest(`
//         mutation {
//           createEpisode (input: {
//             title: "${newEpisode.EPISODE_TITLE}"
//             category: "${newEpisode.EPISODE_CATEGORY}"
//             podcastId: ${podcastId}
//           }) {
//             ok
//             error
//             id
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     createEpisode: { ok, error, id },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBe(null);
//               expect(id).toBe(EPISODE_ID);
//             });
//       });
//     });
//     describe('getEpisodes', () => {
//       it('should get episodes ', () => {
//         return publicTest(`
//         {
//           getEpisodes(input: {
//             id: ${podcastId}
//           }) {
//             error
//             ok
//             episodes {
//               id
//               title
//               category
//             }
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     getEpisodes: { ok, error, episodes },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//               expect(episodes).toBeInstanceOf(Array);
//               expect(episodes[0]).toHaveProperty(
//                   'title',
//                   newEpisode.EPISODE_TITLE,
//               );
//               expect(episodes[0]).toHaveProperty(
//                   'category',
//                   newEpisode.EPISODE_CATEGORY,
//               );
//             });
//       });
//     });
//     describe('updateEpisode', () => {
//       const updatedEpisode = {
//         TITLE: 'Episode Ver2',
//         CATEGORY: 'DRAMA',
//       };
//       it('should update episode', () => {
//         return publicTest(`
//         mutation {
//           updateEpisode(input: {
//             podcastId: ${podcastId}
//             episodeId: ${EPISODE_ID}
//             title: "${updatedEpisode.TITLE}"
//             category: "${updatedEpisode.CATEGORY}"
//           }) {
//             error
//             ok
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     updateEpisode: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//             });
//       });
//       it('should have new episode', () => {
//         return publicTest(`
//         {
//           getEpisodes(input: {
//             id: ${podcastId}
//           }) {
//             error
//             ok
//             episodes {
//               id
//               title
//               category
//             }
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     getEpisodes: { ok, error, episodes },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//               expect(episodes).toHaveLength(1);
//               expect(episodes[0]).toHaveProperty('title', updatedEpisode.TITLE);
//               expect(episodes[0]).toHaveProperty(
//                   'category',
//                   updatedEpisode.CATEGORY,
//               );
//             });
//       });
//     });
//     describe('deleteEpisode', () => {
//       it('should delete episode', () => {
//         return publicTest(`
//         mutation {
//           deleteEpisode(input: {
//             podcastId: ${podcastId}
//             episodeId: ${EPISODE_ID}
//           }) {
//             error
//             ok
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     deleteEpisode: { ok, error },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//             });
//       });
//       it('should have empty episode', () => {
//         return publicTest(`
//         {
//           getEpisodes(input: {
//             id: ${podcastId}
//           }) {
//             error
//             ok
//             episodes {
//               id
//               title
//               category
//             }
//           }
//         }
//         `)
//             .expect(200)
//             .expect(res => {
//               const {
//                 body: {
//                   data: {
//                     getEpisodes: { ok, error, episodes },
//                   },
//                 },
//               } = res;
//               expect(ok).toBe(true);
//               expect(error).toBeNull();
//               expect(episodes).toHaveLength(0);
//             });
//       });
//     });
//   });
// });
