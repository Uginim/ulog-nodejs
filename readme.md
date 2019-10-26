# Ulog-nodejs
개인용 블로그 서비스

## 실행환경
* Redis
* MySQL
* Node.js

## 실행 방법
1. .env 파일 생성
```
./ulog-nodejs/.env
```
2. .env 파일 설정
```
COOKIE_SECRET='secret'
SEQUELIZE_PASSWORD='password'
REDIS_HOST='host'
REDIS_PORT='port'
REDIS_PASSWORD='redis password'
```

3. 실행
```
$ npm run start
```

