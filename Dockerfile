# 베이스 이미지
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치 (프로덕션만)
RUN npm ci --only=production

# PM2 글로벌 설치
RUN npm install -g pm2

# 소스 코드 복사
COPY . .

# 업로드 디렉토리 생성
RUN mkdir -p /app/uploads /app/logs

# 포트 노출
EXPOSE 8001

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:8001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# PM2로 앱 시작
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
