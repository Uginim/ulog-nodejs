# 🚀 Node.js → Kotlin Ktor 마이그레이션 계획

현재 Node.js + Express 블로그 앱을 Kotlin Ktor로 마이그레이션하는 상세 계획입니다.

## 📋 목차
1. [왜 Ktor인가?](#왜-ktor인가)
2. [프로젝트 구조](#프로젝트-구조)
3. [기술 스택 매핑](#기술-스택-매핑)
4. [마이그레이션 단계](#마이그레이션-단계)
5. [코드 변환 예시](#코드-변환-예시)
6. [테스트 계획](#테스트-계획)
7. [배포 전략](#배포-전략)

---

## 🎯 왜 Ktor인가?

### 장점
✅ **타입 안정성**: Kotlin의 강력한 타입 시스템
✅ **성능**: 코루틴 기반 비동기 처리 (Node.js보다 빠를 수 있음)
✅ **간결성**: Kotlin의 문법으로 더 적은 코드
✅ **멀티플랫폼**: JVM, Native, JS 지원
✅ **테스트 용이성**: 의존성 주입과 모킹이 쉬움

### 단점
❌ **학습 곡선**: Kotlin과 Ktor 학습 필요
❌ **메모리 사용량**: JVM은 Node.js보다 더 많은 메모리 사용
❌ **빌드 시간**: Gradle 빌드가 npm보다 느림
❌ **에코시스템**: Node.js보다 작은 생태계

---

## 🏗️ 프로젝트 구조

### 현재 (Node.js)
```
ulog-nodejs/
├── app.js                    # 메인 엔트리
├── models/                   # Sequelize 모델
├── routes/                   # Express 라우트
├── views/                    # Pug 템플릿
├── public/                   # 정적 파일
└── passport/                 # 인증
```

### 목표 (Kotlin Ktor)
```
ulog-ktor/
├── src/
│   ├── main/
│   │   ├── kotlin/
│   │   │   ├── com.ulog/
│   │   │   │   ├── Application.kt          # 메인 엔트리
│   │   │   │   ├── plugins/                # Ktor 플러그인 설정
│   │   │   │   │   ├── Routing.kt
│   │   │   │   │   ├── Security.kt
│   │   │   │   │   ├── Serialization.kt
│   │   │   │   │   └── Database.kt
│   │   │   │   ├── routes/                 # 라우트 핸들러
│   │   │   │   │   ├── PostRoutes.kt
│   │   │   │   │   ├── AuthRoutes.kt
│   │   │   │   │   ├── AdminRoutes.kt
│   │   │   │   │   └── PageRoutes.kt
│   │   │   │   ├── models/                 # 데이터 모델
│   │   │   │   │   ├── Post.kt
│   │   │   │   │   ├── User.kt
│   │   │   │   │   ├── Comment.kt
│   │   │   │   │   └── Tag.kt
│   │   │   │   ├── repositories/           # 데이터베이스 액세스
│   │   │   │   │   ├── PostRepository.kt
│   │   │   │   │   ├── UserRepository.kt
│   │   │   │   │   └── CommentRepository.kt
│   │   │   │   ├── services/               # 비즈니스 로직
│   │   │   │   │   ├── PostService.kt
│   │   │   │   │   ├── AuthService.kt
│   │   │   │   │   └── CommentService.kt
│   │   │   │   └── utils/                  # 유틸리티
│   │   │   │       ├── Security.kt
│   │   │   │       └── DateFormatter.kt
│   │   └── resources/
│   │       ├── application.conf            # 설정 파일
│   │       ├── logback.xml                 # 로깅 설정
│   │       └── templates/                  # HTML 템플릿
│   │           ├── layouts/
│   │           │   └── main.ftl
│   │           ├── post.ftl
│   │           ├── post-page.ftl
│   │           └── admin/
│   └── test/
│       └── kotlin/
│           └── com.ulog/
│               ├── ApplicationTest.kt
│               ├── routes/
│               └── repositories/
├── gradle/
├── build.gradle.kts                        # Gradle 빌드 설정
├── Dockerfile
└── docker-compose.yml
```

---

## 🔄 기술 스택 매핑

| Node.js 기술 | Ktor 대안 | 비고 |
|-------------|----------|------|
| **프레임워크** |
| Express | Ktor | 경량 프레임워크 |
| **템플릿 엔진** |
| Pug | FreeMarker / Thymeleaf | FreeMarker 추천 (간결) |
| **ORM** |
| Sequelize | Exposed | JetBrains 공식 ORM |
| | Ktorm | 더 간결한 DSL |
| **인증** |
| Passport | Ktor Auth | 내장 플러그인 |
| bcrypt | BCrypt (JVM) | 동일한 알고리즘 |
| **세션** |
| express-session + Redis | Ktor Sessions + Redis | 플러그인 + Lettuce |
| **검증** |
| validator | Ktor Validation | 또는 Konform |
| **로깅** |
| Winston | Logback / SLF4J | Kotlin 표준 |
| **테스트** |
| Jest/Mocha | Kotest / JUnit 5 | Kotest 추천 |
| **HTTP 클라이언트** |
| Axios | Ktor Client | 내장 클라이언트 |
| **JSON** |
| JSON.stringify | kotlinx.serialization | Kotlin 공식 |

---

## 📅 마이그레이션 단계

### Phase 1: 프로젝트 셋업 (1주)
- [ ] Gradle 프로젝트 생성
- [ ] 기본 Ktor 설정
- [ ] 데이터베이스 연결 (Exposed)
- [ ] Docker 환경 구성

### Phase 2: 데이터 모델 마이그레이션 (1주)
- [ ] User 모델 → Kotlin data class
- [ ] Post 모델 → Kotlin data class
- [ ] Comment 모델 → Kotlin data class
- [ ] Tag 모델 → Kotlin data class
- [ ] Category 모델 → Kotlin data class
- [ ] 관계 설정 (Exposed Relations)

### Phase 3: 인증 시스템 (1주)
- [ ] BCrypt 비밀번호 해싱
- [ ] Session 기반 인증
- [ ] Redis 세션 저장소 연동
- [ ] 미들웨어 (인증 체크)

### Phase 4: API 라우트 마이그레이션 (2주)
- [ ] POST /post/write
- [ ] GET /post
- [ ] GET /post/:id
- [ ] POST /post/:id/comment
- [ ] POST /auth/signin
- [ ] POST /auth/signup
- [ ] GET /admin
- [ ] POST /admin/categories

### Phase 5: 뷰 템플릿 마이그레이션 (1주)
- [ ] Pug → FreeMarker 변환
- [ ] main-layout.ftl
- [ ] post.ftl
- [ ] post-page.ftl
- [ ] admin/*.ftl

### Phase 6: 정적 파일 & 에셋 (3일)
- [ ] CSS/JS 파일 그대로 사용
- [ ] 파일 업로드 기능 (multipart)
- [ ] 이미지 서빙

### Phase 7: 테스트 (1주)
- [ ] 단위 테스트 (Repositories)
- [ ] 통합 테스트 (Routes)
- [ ] E2E 테스트

### Phase 8: 배포 & 최적화 (3일)
- [ ] Docker 이미지 빌드
- [ ] 성능 테스트
- [ ] 메모리 최적화
- [ ] 프로덕션 배포

**총 예상 기간: 6-8주**

---

## 💻 코드 변환 예시

### 1. 프로젝트 설정

#### build.gradle.kts
```kotlin
plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.serialization") version "1.9.22"
    id("io.ktor.plugin") version "2.3.7"
    id("org.jetbrains.kotlin.plugin.allopen") version "1.9.22"
}

group = "com.ulog"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    // Ktor 서버
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-auth:2.3.7")
    implementation("io.ktor:ktor-server-sessions:2.3.7")
    implementation("io.ktor:ktor-server-freemarker:2.3.7")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.7")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")

    // 데이터베이스
    implementation("org.jetbrains.exposed:exposed-core:0.46.0")
    implementation("org.jetbrains.exposed:exposed-dao:0.46.0")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.46.0")
    implementation("org.jetbrains.exposed:exposed-java-time:0.46.0")
    implementation("mysql:mysql-connector-java:8.0.33")
    implementation("com.zaxxer:HikariCP:5.0.1")

    // Redis
    implementation("io.lettuce:lettuce-core:6.3.0.RELEASE")

    // BCrypt
    implementation("org.mindrot:jbcrypt:0.4")

    // 로깅
    implementation("ch.qos.logback:logback-classic:1.4.14")

    // 테스트
    testImplementation("io.ktor:ktor-server-tests:2.3.7")
    testImplementation("io.kotest:kotest-runner-junit5:5.8.0")
    testImplementation("io.mockk:mockk:1.13.8")
}

application {
    mainClass.set("com.ulog.ApplicationKt")
}
```

---

### 2. 메인 애플리케이션

#### Application.kt
```kotlin
package com.ulog

import com.ulog.plugins.*
import io.ktor.server.application.*
import io.ktor.server.netty.*

fun main(args: Array<String>) {
    EngineMain.main(args)
}

fun Application.module() {
    // 플러그인 설정
    configureDatabase()
    configureSecurity()
    configureSerialization()
    configureRouting()
    configureTemplating()
    configureSessions()
}
```

#### application.conf
```hocon
ktor {
    deployment {
        port = 8001
        port = ${?PORT}
    }
    application {
        modules = [ com.ulog.ApplicationKt.module ]
    }
}

database {
    host = "localhost"
    host = ${?DB_HOST}
    port = 3306
    port = ${?DB_PORT}
    name = "ulog"
    name = ${?DB_NAME}
    user = "root"
    user = ${?DB_USER}
    password = ""
    password = ${?DB_PASSWORD}
}

redis {
    host = "localhost"
    host = ${?REDIS_HOST}
    port = 6379
    port = ${?REDIS_PORT}
}

session {
    secret = "change-this-secret"
    secret = ${?SESSION_SECRET}
}
```

---

### 3. 데이터 모델

#### Node.js (Sequelize)
```javascript
// models/post.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('post', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        summary: {
            type: DataTypes.STRING(500),
        },
    }, {
        timestamps: true,
        underscored: false,
    });
};
```

#### Kotlin (Exposed)
```kotlin
// models/Post.kt
package com.ulog.models

import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.dao.id.*
import org.jetbrains.exposed.sql.javatime.*

object Posts : IntIdTable("posts") {
    val title = varchar("title", 100)
    val content = text("content")
    val summary = varchar("summary", 500).nullable()
    val categoryId = reference("categoryId", Categories).nullable()
    val createdAt = datetime("createdAt")
    val updatedAt = datetime("updatedAt")
}

class Post(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Post>(Posts)

    var title by Posts.title
    var content by Posts.content
    var summary by Posts.summary
    var category by Category optionalReferencedOn Posts.categoryId
    var createdAt by Posts.createdAt
    var updatedAt by Posts.updatedAt

    // Many-to-Many 관계
    var tags by Tag via PostTags

    // One-to-Many 관계
    val comments by Comment referrersOn Comments.postId
}

// DTO (Data Transfer Object)
@Serializable
data class PostDTO(
    val id: Int,
    val title: String,
    val content: String,
    val summary: String?,
    val createdAt: String,
    val tags: List<TagDTO> = emptyList()
)

fun Post.toDTO() = PostDTO(
    id = id.value,
    title = title,
    content = content,
    summary = summary,
    createdAt = createdAt.toString(),
    tags = tags.map { it.toDTO() }
)
```

---

### 4. Repository 패턴

```kotlin
// repositories/PostRepository.kt
package com.ulog.repositories

import com.ulog.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class PostRepository {

    fun findAll(): List<Post> = transaction {
        Post.all()
            .orderBy(Posts.createdAt to SortOrder.DESC)
            .toList()
    }

    fun findById(id: Int): Post? = transaction {
        Post.findById(id)
    }

    fun create(
        title: String,
        content: String,
        summary: String?,
        categoryId: Int?,
        tagTitles: List<String>
    ): Post = transaction {
        val post = Post.new {
            this.title = title
            this.content = content
            this.summary = summary
            this.category = categoryId?.let { Category.findById(it) }
            this.createdAt = LocalDateTime.now()
            this.updatedAt = LocalDateTime.now()
        }

        // 태그 처리
        tagTitles.forEach { tagTitle ->
            val tag = Tag.find { Tags.title eq tagTitle }.firstOrNull()
                ?: Tag.new { this.title = tagTitle }
            post.tags = SizedCollection(post.tags.toList() + tag)
        }

        post
    }

    fun update(
        id: Int,
        title: String,
        content: String,
        summary: String?,
        categoryId: Int?
    ): Post? = transaction {
        Post.findById(id)?.apply {
            this.title = title
            this.content = content
            this.summary = summary
            this.category = categoryId?.let { Category.findById(it) }
            this.updatedAt = LocalDateTime.now()
        }
    }

    fun delete(id: Int): Boolean = transaction {
        Post.findById(id)?.delete()
        true
    }
}
```

---

### 5. 라우트 핸들러

#### Node.js (Express)
```javascript
// routes/post.js
router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            attributes:['id','title','summary','createdAt'],
            include:[{
                model:Tag,
                attributes:['title'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.render('post', {
            title: await getBlogTitle(),
            blogTitle: await getBlogTitle(),
            posts: posts,
            user: req.user,
        });
    } catch(error) {
        console.error(error);
        next(error);
    }
});
```

#### Kotlin (Ktor)
```kotlin
// routes/PostRoutes.kt
package com.ulog.routes

import com.ulog.models.*
import com.ulog.repositories.PostRepository
import com.ulog.services.BlogInfoService
import io.ktor.server.application.*
import io.ktor.server.freemarker.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*

fun Route.postRoutes() {
    val postRepository = PostRepository()
    val blogInfoService = BlogInfoService()

    // 포스트 목록
    get("/post") {
        val posts = postRepository.findAll()
        val user = call.sessions.get<UserSession>()

        call.respond(FreeMarkerContent(
            "post.ftl",
            mapOf(
                "title" to blogInfoService.getBlogTitle(),
                "blogTitle" to blogInfoService.getBlogTitle(),
                "posts" to posts.map { it.toDTO() },
                "user" to user
            )
        ))
    }

    // 포스트 상세
    get("/post/{id}") {
        val id = call.parameters["id"]?.toIntOrNull()
            ?: return@get call.respond(HttpStatusCode.BadRequest)

        val post = postRepository.findById(id)
            ?: return@get call.respond(HttpStatusCode.NotFound)

        val user = call.sessions.get<UserSession>()

        call.respond(FreeMarkerContent(
            "post-page.ftl",
            mapOf(
                "title" to post.title,
                "blogTitle" to blogInfoService.getBlogTitle(),
                "post" to post.toDTO(),
                "user" to user
            )
        ))
    }

    // 포스트 작성/수정
    post("/post/write") {
        val user = call.sessions.get<UserSession>()
            ?: return@post call.respond(HttpStatusCode.Unauthorized)

        val params = call.receiveParameters()
        val id = params["id"]?.toIntOrNull()
        val title = params["title"] ?: return@post call.respond(HttpStatusCode.BadRequest)
        val content = params["content"] ?: return@post call.respond(HttpStatusCode.BadRequest)
        val summary = params["summary"]
        val categoryId = params["category"]?.toIntOrNull()
        val tags = params["tags"]
            ?.let { Regex("#[^\\s#]+").findAll(it).map { it.value.drop(1) }.toList() }
            ?: emptyList()

        if (id != null) {
            postRepository.update(id, title, content, summary, categoryId)
        } else {
            postRepository.create(title, content, summary, categoryId, tags)
        }

        call.respondRedirect("/admin")
    }
}
```

---

### 6. 인증 시스템

```kotlin
// plugins/Security.kt
package com.ulog.plugins

import com.ulog.models.UserSession
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.sessions.*
import io.ktor.util.*
import org.mindrot.jbcrypt.BCrypt

data class UserSession(
    val id: Int,
    val username: String,
    val email: String,
    val adminPermission: Boolean
) : Principal

fun Application.configureSecurity() {
    install(Sessions) {
        cookie<UserSession>("user_session") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 60 * 60 * 24 * 7 // 7일
            cookie.httpOnly = true
            cookie.secure = false // 프로덕션에서는 true
        }
    }

    install(Authentication) {
        session<UserSession>("auth-session") {
            validate { session ->
                session
            }
            challenge {
                call.respondRedirect("/signin")
            }
        }
    }
}

// 비밀번호 유틸리티
object PasswordUtil {
    fun hash(password: String): String = BCrypt.hashpw(password, BCrypt.gensalt())
    fun verify(password: String, hashed: String): Boolean = BCrypt.checkpw(password, hashed)
}
```

---

### 7. 템플릿 변환

#### Pug
```pug
extends layout

block content
    div(class='row mb-2')
        each post in posts
            div(class='col-md-6 mb-4')
                div(class='blog-post-card')
                    h3=post.title
                    p=post.summary
                    a(href=`./post/${post.id}`) 더 읽기
```

#### FreeMarker
```ftl
<#-- post.ftl -->
<@layout.main title=title blogTitle=blogTitle user=user>
    <div class="row mb-2">
        <#list posts as post>
            <div class="col-md-6 mb-4">
                <div class="blog-post-card">
                    <div class="card-body">
                        <#if post.tags?has_content>
                            <div class="mb-3">
                                <#list post.tags as tag>
                                    <span class="post-tag">#${tag.title}</span>
                                </#list>
                            </div>
                        </#if>
                        <h3 class="mb-2 font-weight-bold">${post.title}</h3>
                        <div class="post-date mb-3">${post.createdAt}</div>
                        <p class="post-summary">${post.summary!"미리보기 없음"}</p>
                        <a class="post-read-more" href="/post/${post.id}">더 읽기</a>
                    </div>
                </div>
            </div>
        </#list>
    </div>
</@layout.main>
```

---

## 🧪 테스트 계획

### 단위 테스트 (Kotest)
```kotlin
// test/repositories/PostRepositoryTest.kt
class PostRepositoryTest : StringSpec({
    val repository = PostRepository()

    beforeTest {
        // 테스트 DB 셋업
        Database.connect(
            "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1",
            driver = "org.h2.Driver"
        )
        transaction {
            SchemaUtils.create(Posts, Tags, PostTags)
        }
    }

    afterTest {
        transaction {
            SchemaUtils.drop(Posts, Tags, PostTags)
        }
    }

    "should create a post" {
        val post = repository.create(
            title = "Test Post",
            content = "Test Content",
            summary = "Test Summary",
            categoryId = null,
            tagTitles = listOf("kotlin", "ktor")
        )

        post.title shouldBe "Test Post"
        post.tags.count() shouldBe 2
    }

    "should find post by id" {
        val created = repository.create("Test", "Content", null, null, emptyList())
        val found = repository.findById(created.id.value)

        found shouldNotBe null
        found?.title shouldBe "Test"
    }
})
```

### 통합 테스트
```kotlin
// test/routes/PostRoutesTest.kt
class PostRoutesTest : StringSpec({
    "GET /post should return post list" {
        testApplication {
            application {
                module()
            }

            val response = client.get("/post")

            response.status shouldBe HttpStatusCode.OK
            response.contentType() shouldContain ContentType.Text.Html
        }
    }

    "POST /post/write should create post" {
        testApplication {
            application {
                module()
            }

            val response = client.post("/post/write") {
                setBody(formUrlEncode(
                    "title" to "New Post",
                    "content" to "Content",
                    "summary" to "Summary",
                    "tags" to "#kotlin #ktor"
                ))
            }

            response.status shouldBe HttpStatusCode.Found
        }
    }
})
```

---

## 🐳 Docker 구성

### Dockerfile
```dockerfile
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle buildFatJar --no-daemon

FROM openjdk:17-slim
WORKDIR /app

# JVM 최적화
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

COPY --from=build /app/build/libs/*-all.jar app.jar
COPY src/main/resources /app/resources

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD curl -f http://localhost:8001/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8001:8001"
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: ulog
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - mysql
      - redis
    networks:
      - ulog-network

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ulog
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - ulog-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - ulog-network

volumes:
  mysql-data:
  redis-data:

networks:
  ulog-network:
```

---

## 📊 성능 비교 예상

| 지표 | Node.js | Ktor (JVM) | 차이 |
|-----|---------|------------|------|
| 메모리 (idle) | ~50MB | ~150MB | 🔺 3배 |
| 메모리 (load) | ~200MB | ~400MB | 🔺 2배 |
| 시작 시간 | ~1초 | ~3초 | 🔺 3배 |
| 요청 처리 (RPS) | ~5000 | ~8000 | 🔼 60% |
| CPU 사용률 | 중간 | 낮음 | 🔼 효율적 |
| 타입 안정성 | ❌ | ✅ | 🔼 |
| 개발 생산성 | ⚡ 빠름 | 🐢 중간 | 🔻 |

---

## 🚢 배포 전략

### Blue-Green 배포
1. 현재 Node.js (Blue) 유지
2. Ktor (Green) 새로 배포
3. 트래픽 5% → Green으로 전환
4. 모니터링 (1주일)
5. 문제 없으면 100% 전환
6. Blue 종료

### 롤백 계획
- Green에서 문제 발생 시 즉시 Blue로 복귀
- 데이터베이스는 동일하므로 롤백 용이

---

## 📈 마이그레이션 체크리스트

### 준비 단계
- [ ] Kotlin 기초 학습 (1주)
- [ ] Ktor 공식 문서 학습 (3일)
- [ ] Exposed ORM 학습 (3일)
- [ ] 개발 환경 셋업 (IntelliJ IDEA)

### 개발 단계
- [ ] 프로젝트 구조 설계
- [ ] 데이터 모델 정의
- [ ] Repository 패턴 구현
- [ ] 라우트 핸들러 구현
- [ ] 템플릿 변환
- [ ] 인증/세션 구현
- [ ] 파일 업로드 구현

### 테스트 단계
- [ ] 단위 테스트 (80% 커버리지 목표)
- [ ] 통합 테스트
- [ ] 성능 테스트
- [ ] 보안 테스트
- [ ] 부하 테스트

### 배포 단계
- [ ] Docker 이미지 빌드
- [ ] 스테이징 배포
- [ ] 프로덕션 배포
- [ ] 모니터링 설정
- [ ] 알림 설정

---

## 💡 추가 고려사항

### 1. 성능 최적화
- **연결 풀링**: HikariCP 설정
- **캐싱**: Redis + Caffeine (인메모리)
- **정적 리소스**: Nginx에서 직접 서빙
- **GC 튜닝**: G1GC 사용

### 2. 모니터링
- **메트릭**: Micrometer + Prometheus
- **로깅**: Logback → ELK Stack
- **APM**: Datadog / New Relic
- **알림**: Slack / Discord

### 3. 보안
- **SQL Injection**: Exposed의 파라미터화된 쿼리
- **XSS**: FreeMarker 자동 이스케이프
- **CSRF**: Ktor CSRF 플러그인
- **Rate Limiting**: Ktor Rate Limit

---

## 📚 학습 자료

### Kotlin
- [Kotlin 공식 문서](https://kotlinlang.org/docs/home.html)
- [Kotlin Koans](https://kotlinlang.org/docs/koans.html)

### Ktor
- [Ktor 공식 문서](https://ktor.io/docs/)
- [Ktor Samples](https://github.com/ktorio/ktor-samples)

### Exposed
- [Exposed Wiki](https://github.com/JetBrains/Exposed/wiki)

---

## 🎯 최종 결정 기준

### Ktor로 마이그레이션할 만한 경우
✅ 타입 안정성이 중요한 경우
✅ 팀이 Kotlin을 선호하는 경우
✅ 성능이 중요한 경우
✅ JVM 생태계 활용이 필요한 경우

### Node.js를 유지해야 하는 경우
✅ 빠른 개발 속도가 중요한 경우
✅ 메모리가 제한적인 경우 (< 1GB)
✅ npm 생태계에 의존하는 경우
✅ 프론트엔드 개발자가 백엔드도 담당하는 경우

---

## 📞 문의 및 지원

마이그레이션 중 문제가 발생하면:
1. [Ktor Slack](https://kotlinlang.slack.com/)
2. [Stack Overflow](https://stackoverflow.com/questions/tagged/ktor)
3. GitHub Issues

**예상 ROI**: 6-8주 투자로 장기적인 유지보수성과 성능 향상 기대
