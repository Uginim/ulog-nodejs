# 📝 Ulog - 현대적인 블로그 플랫폼

Node.js + Express로 만든 풀스택 블로그 애플리케이션입니다.

## ✨ 주요 기능

- 🎨 **현대적인 디자인**: 그라디언트, 글래스모피즘, 부드러운 애니메이션
- 🌓 **다크 모드**: 자동 저장되는 테마 설정
- 📝 **마크다운 에디터**: Toast UI Editor 기반
- 🏷️ **태그 시스템**: 해시태그로 포스트 분류
- 💬 **댓글 시스템**: 실시간 댓글 작성
- 👨‍💼 **관리자 대시보드**: 포스트, 카테고리 관리
- 🔐 **인증/세션**: Passport.js + Redis 세션

## 🚀 빠른 시작 (클릭 한 번으로 배포!)

### Railway로 5분 배포 (가장 쉬움!)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/ulog-nodejs)

1. 위 버튼 클릭
2. GitHub 로그인
3. 환경변수 입력
4. Deploy 클릭
5. 완료! 🎉

**비용**: $5 무료 크레딧 → 이후 $5-10/월

---

### Render로 무료 배포

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Uginim/ulog-nodejs)

**비용**: 무료 (느림, 15분 슬립) → 유료 $14/월

---

## 💰 더 많은 배포 옵션

| 플랫폼 | 비용 | 난이도 | 배포 시간 | 가이드 |
|--------|------|--------|----------|--------|
| **Railway** | $5-10/월 | ⭐ | 5분 | [보기](docs/CHEAP_EASY_DEPLOY.md#railway) |
| **Oracle Free** | **$0** | ⭐⭐⭐ | 30분 | [보기](docs/CHEAP_EASY_DEPLOY.md#oracle-free) |
| **Render** | $0-14/월 | ⭐⭐ | 10분 | [보기](docs/CHEAP_EASY_DEPLOY.md#render) |
| **Fly.io** | $0-3/월 | ⭐⭐ | 15분 | [보기](docs/CHEAP_EASY_DEPLOY.md#flyio) |
| **VPS (Docker)** | $5-20/월 | ⭐⭐⭐ | 20분 | [보기](docs/INFRASTRUCTURE.md) |

📚 **전체 가이드**: [초저가/무료 배포 가이드](docs/CHEAP_EASY_DEPLOY.md)

---

## 🛠️ 로컬 개발

### 필수 요구사항

- Node.js 18+
- MySQL 8.0+
- Redis 7+

### 설치

```bash
# 1. 클론
git clone https://github.com/Uginim/ulog-nodejs.git
cd ulog-nodejs

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env
nano .env  # 설정 편집

# 4. 데이터베이스 초기화
node init.js

# 5. 관리자 계정 생성
node admin-register.js

# 6. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:8001` 접속

---

## 🐳 Docker로 실행

```bash
# 1. 환경변수 설정
cp .env.example .env
nano .env

# 2. Docker Compose 실행
docker-compose up -d

# 3. 확인
curl http://localhost:8001
```

---

## 📁 프로젝트 구조

```
ulog-nodejs/
├── app.js              # 메인 애플리케이션
├── routes/             # Express 라우트
│   ├── post.js         # 포스트 관련
│   ├── auth.js         # 인증
│   ├── admin.js        # 관리자
│   └── page.js         # 페이지
├── models/             # Sequelize 모델
│   ├── post.js
│   ├── user.js
│   ├── comment.js
│   └── tag.js
├── views/              # Pug 템플릿
│   ├── post.pug
│   ├── post-page.pug
│   ├── admin/
│   └── includes/
├── public/             # 정적 파일
│   ├── main.css
│   └── javascript/
├── docs/               # 문서
│   ├── CHEAP_EASY_DEPLOY.md      # 배포 가이드
│   ├── INFRASTRUCTURE.md          # 인프라 구성
│   └── KTOR_MIGRATION_PLAN.md    # Kotlin 마이그레이션
└── docker-compose.yml
```

---

## 🧪 테스트

```bash
npm test
```

---

## 📚 상세 문서

- 🚀 [초저가/쉬운 배포 가이드](docs/CHEAP_EASY_DEPLOY.md) - Railway, Oracle, Render 등
- 🏗️ [인프라 구성 가이드](docs/INFRASTRUCTURE.md) - VPS, Docker, Nginx 설정
- 🔄 [Kotlin Ktor 마이그레이션 계획](docs/KTOR_MIGRATION_PLAN.md) - Node.js → Kotlin

---

## 🎯 기술 스택

### 백엔드
- **프레임워크**: Express.js 4.17
- **ORM**: Sequelize 5.19
- **데이터베이스**: MySQL 8.0
- **캐시/세션**: Redis 7
- **인증**: Passport.js (Local Strategy)
- **보안**: Helmet, HPP, bcrypt

### 프론트엔드
- **템플릿**: Pug 2.0
- **스타일**: Bootstrap 4 + Custom CSS
- **에디터**: Toast UI Editor
- **다크 모드**: localStorage 기반

### DevOps
- **프로세스 관리**: PM2
- **컨테이너**: Docker + Docker Compose
- **리버스 프록시**: Nginx
- **CI/CD**: GitHub Actions

---

## 🌟 주요 기능 스크린샷

### 메인 페이지
- 현대적인 카드 디자인
- 태그 시스템
- 다크 모드

### 포스트 작성
- 마크다운 에디터
- 이미지 업로드
- 카테고리 관리

### 관리자 대시보드
- 탭 기반 UI
- 포스트 관리
- 카테고리 트리

---

## 🔐 환경변수

필수 환경변수:

```env
# 데이터베이스
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ulog
DB_USER=your_user
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# 세션
SESSION_SECRET=your-very-long-secret-min-32-chars

# 애플리케이션
NODE_ENV=production
PORT=8001
```

전체 목록: [.env.example](.env.example)

---

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

MIT License

---

## 🆘 문제 해결

### 앱이 시작되지 않을 때
```bash
# 로그 확인
pm2 logs

# 또는 Docker 로그
docker-compose logs -f app
```

### 데이터베이스 연결 실패
```bash
# MySQL 상태 확인
systemctl status mysql

# 연결 테스트
mysql -h localhost -u root -p
```

### 더 많은 문제 해결
- [인프라 가이드 - 트러블슈팅](docs/INFRASTRUCTURE.md#troubleshooting)
- [GitHub Issues](https://github.com/Uginim/ulog-nodejs/issues)

---

## 📞 지원

- 📖 [문서](docs/)
- 🐛 [이슈 제보](https://github.com/Uginim/ulog-nodejs/issues)
- 💬 [토론](https://github.com/Uginim/ulog-nodejs/discussions)

---

## 🙏 감사

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Passport.js](http://www.passportjs.org/)
- [Toast UI Editor](https://ui.toast.com/tui-editor)
- [Bootstrap](https://getbootstrap.com/)

---

Made with ❤️ by [Uginim](https://github.com/Uginim)
