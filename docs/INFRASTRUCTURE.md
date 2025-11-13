# 🏗️ 인프라 구성 가이드

블로그 앱을 위한 비용 효율적인 인프라 구성 방법을 안내합니다.

## 💰 예산별 추천 옵션 (월 $20 이하)

### 🥇 최고 추천: DigitalOcean Droplet + 관리형 DB ($18/월)

```
총 비용: $18/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[앱 서버]        DigitalOcean Droplet          $6/월
                 - 1GB RAM, 1 vCPU, 25GB SSD
                 - Ubuntu 22.04
                 - Node.js + PM2 + Redis

[데이터베이스]   DigitalOcean Managed MySQL    $15/월
                 - 1GB RAM, 1 vCPU, 10GB
                 - 자동 백업 포함
                 - 고가용성

[도메인]         Namecheap                     $10/년
[SSL]            Let's Encrypt                 무료
[CDN]            Cloudflare Free               무료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**장점**:
- ✅ 데이터베이스 자동 백업
- ✅ 관리 부담 최소화
- ✅ 안정적인 성능
- ✅ 쉬운 스케일 업

**단점**:
- ❌ 예산 한계치에 근접

---

### 🥈 가성비 최고: Railway All-in-One ($15/월)

```
총 비용: $15/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[올인원]         Railway                       $10-15/월
                 - Node.js 앱 호스팅
                 - PostgreSQL/MySQL
                 - Redis 포함
                 - 자동 배포
                 - SSL 포함

[도메인]         Namecheap                     $10/년
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**장점**:
- ✅ 가장 간단한 배포
- ✅ GitHub 자동 연동
- ✅ 무료 SSL
- ✅ 관리 불필요

**단점**:
- ❌ 커스터마이징 제한
- ❌ 트래픽 제한 있음

---

### 🥉 초저예산: Hetzner VPS ($5/월)

```
총 비용: $5-7/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[VPS]            Hetzner Cloud                 €4.51/월 (~$5)
                 - 2GB RAM, 1 vCPU, 40GB SSD
                 - Ubuntu 22.04
                 - Node.js + MySQL + Redis

[도메인]         Namecheap                     $10/년
[SSL]            Let's Encrypt                 무료
[백업]           Hetzner Snapshot              €0.012/GB/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**장점**:
- ✅ 가장 저렴
- ✅ 높은 스펙
- ✅ 완전한 제어권

**단점**:
- ❌ 모든 것을 직접 관리
- ❌ 백업 수동 설정 필요
- ❌ 유럽 데이터센터 (한국에서 느릴 수 있음)

---

### 🎯 추천 구성: Vultr VPS ($6/월)

**이 옵션을 선택하는 이유**:
- 한국/일본 데이터센터 사용 가능 (낮은 레이턴시)
- 합리적인 가격
- 간단한 관리
- Docker 지원

```
총 비용: $7/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[VPS]            Vultr Cloud Compute           $6/월
                 - 1GB RAM, 1 vCPU, 25GB SSD
                 - 서울/도쿄 리전
                 - Ubuntu 22.04

[도메인]         Namecheap .com                $10/년
[SSL]            Let's Encrypt                 무료
[백업]           Vultr Snapshots               $1/월
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🚀 배포 방법

### 옵션 1: Docker Compose (추천!)

1. **서버 준비**
```bash
# SSH 접속
ssh root@your-server-ip

# 필수 패키지 설치
apt update && apt upgrade -y
apt install -y docker.io docker-compose git nginx certbot

# Docker 서비스 시작
systemctl start docker
systemctl enable docker
```

2. **저장소 클론**
```bash
cd /opt
git clone https://github.com/Uginim/ulog-nodejs.git
cd ulog-nodejs
```

3. **환경 변수 설정**
```bash
cp .env.example .env
nano .env  # 설정 편집
```

4. **데이터베이스 초기화**
```bash
docker-compose up -d mysql redis
sleep 10
docker-compose exec mysql mysql -u root -p < init.sql
```

5. **앱 시작**
```bash
docker-compose up -d
```

6. **SSL 인증서 발급**
```bash
certbot certonly --standalone -d your-domain.com
# 인증서를 nginx/ssl 폴더로 복사
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/
```

---

### 옵션 2: PM2 직접 실행 (간단)

1. **서버 준비**
```bash
# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# MySQL 설치
apt install -y mysql-server
mysql_secure_installation

# Redis 설치
apt install -y redis-server
systemctl start redis
systemctl enable redis

# PM2 설치
npm install -g pm2
```

2. **앱 설정**
```bash
cd /opt
git clone https://github.com/Uginim/ulog-nodejs.git
cd ulog-nodejs
npm install
cp .env.example .env
nano .env  # 설정 편집
```

3. **데이터베이스 초기화**
```bash
node init.js
node admin-register.js
```

4. **PM2로 앱 시작**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. **Nginx 설정**
```bash
# Nginx 설치
apt install -y nginx

# 설정 파일 복사
cp nginx/nginx.conf /etc/nginx/nginx.conf
nginx -t
systemctl restart nginx
```

---

## 📊 리소스 모니터링

### PM2 모니터링
```bash
# 프로세스 상태 확인
pm2 status

# 로그 확인
pm2 logs

# 리소스 사용량
pm2 monit

# 재시작
pm2 restart ulog-blog
```

### Docker 모니터링
```bash
# 컨테이너 상태
docker-compose ps

# 로그 확인
docker-compose logs -f app

# 리소스 사용량
docker stats

# 재시작
docker-compose restart app
```

---

## 🔒 보안 설정

### 1. 방화벽 설정 (UFW)
```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. 자동 보안 업데이트
```bash
apt install unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

### 3. SSH 보안 강화
```bash
# /etc/ssh/sshd_config 편집
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

---

## 📦 백업 전략

### 자동 백업 스크립트
```bash
#!/bin/bash
# /opt/backup.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# MySQL 백업
docker-compose exec -T mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD ulog > "$BACKUP_DIR/db_$DATE.sql"

# 업로드 파일 백업
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" uploads/

# 7일 이상 된 백업 삭제
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Cron 설정
```bash
# 매일 새벽 2시에 백업
crontab -e
# 추가: 0 2 * * * /opt/backup.sh
```

---

## 🔄 자동 배포 (CI/CD)

GitHub Actions를 통한 자동 배포는 별도 문서 참고:
- `docs/CICD.md` - GitHub Actions 설정
- `.github/workflows/deploy.yml` - 배포 워크플로우

---

## 📈 성능 최적화

### 1. Nginx 캐싱
- 정적 파일은 Nginx가 직접 서빙
- 브라우저 캐시 헤더 설정
- Gzip 압축 활성화

### 2. Redis 세션 저장
- 메모리 기반 빠른 세션 관리
- 서버 재시작 시 세션 유지

### 3. PM2 클러스터 모드
- CPU 코어 수만큼 프로세스 생성
- 로드 밸런싱 자동 처리

### 4. Cloudflare CDN (무료)
- DNS 레벨 캐싱
- DDoS 보호
- 자동 HTTPS

---

## 🆘 트러블슈팅

### 앱이 시작되지 않을 때
```bash
# 로그 확인
pm2 logs --err
# 또는
docker-compose logs app

# 포트 확인
netstat -tulpn | grep 8001

# 프로세스 확인
ps aux | grep node
```

### 데이터베이스 연결 실패
```bash
# MySQL 상태 확인
systemctl status mysql
# 또는
docker-compose logs mysql

# 연결 테스트
mysql -h localhost -u ulog_user -p
```

### 메모리 부족
```bash
# 스왑 추가 (2GB)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 📞 지원 및 문의

- GitHub Issues: https://github.com/Uginim/ulog-nodejs/issues
- 문서: `docs/` 폴더 참고
