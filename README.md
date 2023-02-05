# TypeScript-Servers

```red
Now Nest Server
```

Typescript와 Nest 및 Express framework 이용한 Server Repos.

# Env

OS: Mac 12

DB: Postgres

## Express

TBD

## Nest

TBD

## Test

Jest, Mock

### Unit Test

### E2E Test














# mutation {
# 	login(input: {
#     email: "yj@naver.com",
#     password: "1234",
#     role: Client
#   }) {
#     ok,
#     error,
#     token
#   }
# }

mutation {
  editProfile(input: {
    email: "yj@naver.com",
    password: "1234"
  }) {
    error, ok
  }
}

# mutation {
#   createAccount(input: {
#     email: "yj@naver.com",
#     password: "1234"
#   }) {
#     error,ok
#   }
# }
