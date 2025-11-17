# 💰 초저가/무료 블로그 배포 가이드

**목표**: 월 $5 이하 또는 무료로 배포하기 + 클릭 몇 번으로 끝내기!

---

## 🏆 추천 순위

| 순위 | 플랫폼 | 비용/월 | 난이도 | 배포 시간 | 추천 대상 |
|-----|-------|--------|--------|----------|-----------|
| 🥇 | **Railway** | $5 무료 → $5+ | ⭐ | 5분 | 가장 쉬움 |
| 🥈 | **Oracle Free Tier** | **$0** | ⭐⭐⭐ | 30분 | 완전 무료 |
| 🥉 | **Render** | $0 → $7+ | ⭐⭐ | 10분 | 무료로 시작 |
| 4위 | **Fly.io** | ~$0-3 | ⭐⭐ | 15분 | 합리적 |
| 5위 | **PikaPods** | $1 | ⭐⭐ | 10분 | 가장 저렴 |

---

## 🥇 Railway - 가장 쉬운 배포! (추천)

### 비용
```
무료 크레딧: $5/월
실제 사용: $5-10/월
  - Node.js 앱: ~$3/월
  - MySQL: ~$2/월
  - Redis: ~$1/월
```

### 장점
✅ **GitHub 연동 자동 배포** (git push만 하면 자동 배포!)
✅ **GUI로 모든 설정** (터미널 필요 없음)
✅ **무료 SSL 자동**
✅ **환경변수 GUI 설정**
✅ **자동 스케일링**
✅ **로그 실시간 확인**

### 배포 방법 (5분 완성!)

#### 1단계: Railway 가입
```
https://railway.app
→ GitHub으로 로그인
→ 신용카드 등록 ($5 무료 크레딧)
```

#### 2단계: 프로젝트 생성
```
Railway Dashboard
→ "New Project"
→ "Deploy from GitHub repo"
→ ulog-nodejs 저장소 선택
```

#### 3단계: 서비스 추가
```
Project에서:
→ "+ New" → "Database" → "MySQL" 선택
→ "+ New" → "Database" → "Redis" 선택
```

#### 4단계: 환경변수 자동 연결
```
Node.js 서비스 클릭
→ "Variables" 탭
→ 다음 추가:

NODE_ENV=production
PORT=8001
SESSION_SECRET=your-secret-here-min-32-chars

# Railway가 자동으로 추가해줌:
DATABASE_URL (MySQL)
REDIS_URL (Redis)
```

#### 5단계: Railway.json 생성 (선택)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 6단계: 배포!
```
git add railway.json
git commit -m "Add Railway config"
git push

→ Railway가 자동으로 감지하고 배포 시작!
→ 2-3분 후 완료
```

#### 7단계: 도메인 설정
```
Railway Dashboard
→ 앱 서비스 클릭
→ "Settings" → "Networking"
→ "Generate Domain" (무료 도메인)
또는
→ "Custom Domain" (본인 도메인 연결)
```

**완료!** 🎉

---

## 🥈 Oracle Cloud Free Tier - 완전 무료! (영구)

### 비용
```
✅ 완전 무료 (신용카드 필요하지만 과금 없음)
✅ 평생 무료 (프로모션 아님)

제공 사항:
- VM 2개 (각 1GB RAM, 1/8 OCPU)
- Block Storage 200GB
- 대역폭 10TB/월
```

### 장점
✅ **완전 무료**
✅ **높은 사양** (1GB RAM x 2)
✅ **평생 무료**
✅ **글로벌 리전** (한국 포함)

### 단점
❌ 설정이 복잡함
❌ VM 직접 관리 필요
❌ 가입 심사 있음 (거절당할 수 있음)

### 배포 방법 (30분)

#### 1단계: Oracle Cloud 가입
```
https://www.oracle.com/cloud/free/
→ "Start for free" 클릭
→ 회원가입 (신용카드 필요, 과금 안됨)
```

#### 2단계: VM 인스턴스 생성
```
Oracle Cloud Console
→ "Create a VM Instance"
→ Image: Ubuntu 22.04
→ Shape: VM.Standard.E2.1.Micro (Always Free)
→ SSH 키 생성/업로드
→ Create
```

#### 3단계: 방화벽 설정
```
Instance Details
→ "Virtual Cloud Network" 클릭
→ Security Lists
→ Ingress Rules 추가:
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
```

#### 4단계: SSH 접속 후 배포
```bash
ssh -i your-key.pem ubuntu@instance-ip

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 프로젝트 클론
git clone https://github.com/Uginim/ulog-nodejs.git
cd ulog-nodejs

# 환경변수 설정
cp .env.example .env
nano .env

# Docker Compose 실행
docker-compose up -d
```

#### 5단계: 도메인 연결
```
Namecheap/Cloudflare DNS 설정
→ A Record: instance-ip
```

**완료!** (무료! 평생!)

---

## 🥉 Render - 무료 티어 (느리지만 무료)

### 비용
```
무료 티어:
  - Web Service: 무료 (15분 무활동 시 슬립)
  - PostgreSQL: 무료 (90일 후 삭제)

유료 시:
  - Web Service: $7/월
  - PostgreSQL: $7/월
  총: $14/월
```

### 장점
✅ **무료 시작 가능**
✅ **GitHub 자동 배포**
✅ **무료 SSL**
✅ **쉬운 설정**

### 단점
❌ 15분 무활동 시 슬립 (다음 요청 시 30초 대기)
❌ PostgreSQL만 지원 (MySQL 없음)
❌ 무료 DB는 90일 후 삭제

### 배포 방법 (10분)

#### 1단계: Render 가입
```
https://render.com
→ GitHub으로 로그인
```

#### 2단계: PostgreSQL 생성
```
Dashboard → "New +"
→ "PostgreSQL"
→ Name: ulog-db
→ Free tier 선택
→ Create
```

#### 3단계: Redis 생성 (유료 $7/월)
```
Dashboard → "New +"
→ "Redis"
→ Name: ulog-redis
→ 플랜 선택 ($7/월, 무료 없음)
```

**대안**: Redis 없이 메모리 세션 사용
```javascript
// app.js에서 변경
// Redis 대신 메모리 세션
app.use(session({
  store: new session.MemoryStore(),
  // ...
}));
```

#### 4단계: Web Service 생성
```
Dashboard → "New +"
→ "Web Service"
→ GitHub 저장소 연결
→ Build Command: npm install
→ Start Command: npm start
→ Free tier 선택
```

#### 5단계: 환경변수 설정
```
Environment:
→ Add Environment Variables

DATABASE_URL: (자동 설정됨)
REDIS_URL: (자동 설정됨)
NODE_ENV: production
SESSION_SECRET: your-secret
```

**완료!**

---

## 4위: Fly.io - 합리적인 가격

### 비용
```
무료 크레딧: ~$5/월 가치
실제 사용: $0-3/월
  - 기본 앱: 무료
  - 추가 리소스: 사용량만큼
```

### 배포 방법 (15분)

#### 1단계: Fly CLI 설치
```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

#### 2단계: 로그인
```bash
fly auth login
```

#### 3단계: 앱 생성
```bash
cd ulog-nodejs
fly launch

# 질문에 답변:
# - App name: ulog-blog (원하는 이름)
# - Region: Seoul (nrt - Tokyo 가까움)
# - PostgreSQL: Yes (무료)
# - Redis: Yes (무료)
```

#### 4단계: 환경변수 설정
```bash
fly secrets set SESSION_SECRET=your-secret-here
```

#### 5단계: 배포
```bash
fly deploy
```

**완료!**

---

## 5위: PikaPods - 가장 저렴 ($1/월)

### 비용
```
$1.19/월부터 시작
  - 매우 저렴
  - 리소스 추가 시 가격 상승
```

### 특징
✅ **가장 저렴한 유료 옵션**
✅ **관리형 서비스**
✅ **오픈소스 앱 전문**

단, **커스텀 Node.js 앱은 지원 안 함** (Ghost, WordPress 등만 지원)

---

## 💡 특수 옵션: Coolify (자체 호스팅)

VPS가 있다면 Coolify로 Vercel/Railway처럼 쉽게 배포!

### 비용
```
VPS: $4-6/월 (Hetzner/Vultr)
Coolify: 무료 (오픈소스)
```

### 설치 (5분)
```bash
# VPS에 SSH 접속
ssh root@your-vps

# Coolify 설치 (원라이너)
curl -fsSL https://get.coollabs.io | bash

# 설치 후:
# → http://your-vps-ip:8000 접속
# → GitHub 연동
# → 저장소 선택해서 배포
```

**Vercel처럼 쉬운 GUI + 저렴한 가격!**

---

## 📊 비교표

| 플랫폼 | 월 비용 | 배포 시간 | 난이도 | 무료 티어 | 자동 배포 | SSL |
|--------|---------|-----------|--------|-----------|-----------|-----|
| **Railway** | $5-10 | 5분 | ⭐ | $5 크레딧 | ✅ | ✅ |
| **Oracle Free** | **$0** | 30분 | ⭐⭐⭐ | ✅ 평생 | ❌ | 수동 |
| **Render** | $0-14 | 10분 | ⭐⭐ | ✅ (제한) | ✅ | ✅ |
| **Fly.io** | $0-3 | 15분 | ⭐⭐ | ~$5 가치 | ✅ | ✅ |
| **Coolify** | $4-6 | 20분 | ⭐⭐ | ❌ | ✅ | ✅ |

---

## 🎯 최종 추천

### 당신이 원하는 것이...

#### 1. **가장 쉬운 배포** 👉 **Railway**
```
비용: $5-10/월
시간: 5분
난이도: ⭐
GitHub 연동 → 자동 배포 → 끝!
```

#### 2. **완전 무료** 👉 **Oracle Cloud**
```
비용: $0 (평생)
시간: 30분
난이도: ⭐⭐⭐
VM 설정 필요하지만 평생 무료!
```

#### 3. **일단 무료로 시작** 👉 **Render**
```
비용: $0 (느림) → $14/월 (빠름)
시간: 10분
난이도: ⭐⭐
무료로 시작해서 필요하면 유료 전환
```

#### 4. **저렴 + 쉬움** 👉 **Coolify**
```
비용: $4-6/월 (VPS)
시간: 20분
난이도: ⭐⭐
Railway처럼 쉬운데 더 저렴!
```

---

## 🚀 지금 바로 시작하기

### Railway로 5분 배포 (가장 추천!)

```bash
# 1. Railway 가입
# https://railway.app (GitHub 로그인)

# 2. 저장소 준비
cd ulog-nodejs
touch railway.json

# railway.json 내용:
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}

# 3. Commit & Push
git add railway.json
git commit -m "Add Railway config"
git push

# 4. Railway에서:
# - New Project → Deploy from GitHub
# - 저장소 선택
# - MySQL, Redis 추가
# - 환경변수 설정
# - Deploy!

# 끝! 🎉
```

---

## 📱 Railway 모바일에서도 관리 가능!

Railway 앱 설치:
- iOS: App Store에서 "Railway"
- Android: Google Play에서 "Railway"

폰으로 배포 상태 확인, 로그 보기, 재시작 가능!

---

## 💬 자주 묻는 질문

**Q: Railway $5 무료 크레딧 다 쓰면?**
A: 신용카드로 자동 과금. 월 $5-10 정도.

**Q: Oracle 가입 거절당하면?**
A: Railway나 Render 사용. Oracle은 심사가 까다로움.

**Q: Render 무료 티어 슬립 모드 해결법?**
A: UptimeRobot (무료)으로 5분마다 핑 보내기.

**Q: 가장 빠른 배포는?**
A: Railway. GitHub 연동만 하면 자동 배포.

**Q: 가장 저렴한 건?**
A: Oracle Free Tier (완전 무료, 평생).

---

## 🎁 보너스: GitHub Actions 자동 배포

Railway/Render는 자동 배포되지만, VPS는 수동 배포 필요.
GitHub Actions로 자동화!

```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/ulog-nodejs
            git pull
            docker-compose down
            docker-compose up -d
```

---

**결론**: Railway가 가장 쉽고 빠름! 5분 만에 배포 완료! 🚀
