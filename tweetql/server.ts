import {ApolloServer} from "@apollo/server"
import {startStandaloneServer} from "@apollo/server/standalone";
import {randomInt} from "crypto";

const typeDefs = `#graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in our data source.
    type User {
        id: ID!
        username: String
    }
    
    # Fucking
    type Tweet {
        id: ID!
        text: String
        author: User
    }
    # Query~
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        ping: String!
    }
    # Mutation~
    type Mutation{
        postTweet(text: String, userId: String): Tweet
        deleteTweet(id:ID): Boolean
    }
`;

const tweets = [
    {
        id: '1',
        text: 'Happy Hello World',
        author: {
            id: 1,
            username: 'Kate Chopin'
        }
    },
    {
        id: '2',
        text: 'Molponica',
        author: {
            id: 1,
            username: 'Paul Auster'
        }
    },
];
const resolvers = {
    Query: {
        allTweets: () => tweets,
        tweet() {
            console.log("I'm Tweet Called~")
            return null
        },
        ping() {
            return "pong"
        }
    },
    Mutation: {
        postTweet: (text:string, userId:string): Object | undefined | null | void => {
            console.log("Post Tweet")
            const newTweet = {
                id: (tweets.length + 1).toString(),
                text: text,
                author: {
                    id: +userId,
                    username: randomInt(0, 100).toString()
                }
            }
            tweets.push(newTweet);
            return newTweet
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
})
const {url} = await startStandaloneServer(server, {
    listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);