# fizzo

Fizika fanidan Milliy sertifikat va DTM imtihonlariga tayyorgarlik ko'rish uchun veb-ilova va Telegram Mini App. Yechimlar bosqichma-bosqich, parametrik SVG animatsiyalar bilan tushuntiriladi.

**Texnologiyalar:** Next.js 16 (App Router), TypeScript, PostgreSQL + Prisma 7 (`@prisma/adapter-pg`), KaTeX, oddiy CSS (framework yo'q), zod, jose.

## 1. Talablar

- Node.js **20.19+**, **22.12+** yoki **24+** (Prisma 7 va ba'zi dev-dependency'lar buni talab qiladi).
- Docker va Docker Compose (lokal Postgres va production deploy uchun).

## 2. Lokal ishga tushirish

```bash
cp .env.example .env
# .env faylini to'ldiring: TELEGRAM_BOT_TOKEN, NEXT_PUBLIC_TELEGRAM_BOT_USERNAME, SESSION_SECRET (32+ belgi)

npm install
docker compose up -d db
npx prisma migrate dev
npm run db:seed

npm run dev
```

Ilova http://localhost:3000 da ochiladi. `/kirish` sahifasida `DEV_LOGIN="true"` bo'lsa, "Test foydalanuvchi bilan kirish" tugmasi orqali haqiqiy Telegram hisobisiz kirish mumkin (faqat `NODE_ENV=production` bo'lmaganda ishlaydi).

Foydali buyruqlar:

```bash
npm run lint    # tsc --noEmit + eslint
npm test        # node --test (pure logic: checkAnswer, streak, telegram-auth)
npm run build   # production build
```

## 3. Telegram botini sozlash

1. Telegram'da [@BotFather](https://t.me/BotFather) bilan suhbat oching.
2. `/newbot` — bot nomi va username so'raydi (masalan `fizzo_bot`). Natijada olingan tokenni `.env`dagi `TELEGRAM_BOT_TOKEN`ga, usernameni `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`ga yozing.
3. **Mini App** sifatida ochish uchun:
   - `/newapp` — botingizni tanlang, nom va rasm yuklang, so'ralganda ilovangiz manzilini kiriting: `https://fizzo.app/kirish` (tavsiya etiladi — darhol kirish oynasini ochadi). Bosh sahifa `https://fizzo.app` ham ishlaydi: Mini App ichida ochilganda avtomatik aniqlab darhol kirgazadi, oddiy brauzerda esa marketing sahifasini ko'rsatadi.
   - Yoki mavjud botga tugma qo'shish uchun `/setmenubutton` — botni tanlang, tugma matni (masalan "Boshlash") va URL'ni kiriting.
4. **Login Widget** domenni tasdiqlash uchun `/setdomain` — ilova joylashgan domenni kiriting (masalan `fizzo.app`). Bu `/kirish` sahifasidagi Telegram Login Widget ishlashi uchun shart.
5. Bot avatari uchun `/setuserpic` — `fizzo-logos/telegram/telegram-avatar-640.png` faylini yuklang.
6. Agar fikr-mulohaza/xatolar uchun alohida yordam boti ishlatmoqchi bo'lsangiz, xuddi shu botni qoldirsangiz ham bo'laveradi — "Savolda xato bormi?" havolasi botga `?start=xato-<slug>` parametri bilan ochiladi.

> `fizzo-logos/` papkasida brend uchun tayyor fayllar bor: `svg/` — ilovaning sarlavhalarida ko'rinadigan asl vektor logotip (`src/components/logo.tsx`, yorug'/qorong'i mavzuga avtomatik moslashadi), `png/` — chop etish uchun rasmlar, `web/` — favicon/PWA belgilari (allaqachon ulangan). `fizzo-landing/` papkasidagi statik sahifa esa `/` manzilidagi marketing (landing) sahifasi sifatida `src/components/landing/` ichida implement qilingan — kirmagan foydalanuvchiga shu sahifa, kirgan foydalanuvchiga esa "Bugun" sahifasi ko'rsatiladi.

## 4. Trafik tahlili (Google Analytics)

Qaysi manbadan (referrer, mamlakat) va qancha foydalanuvchi kelayotganini ko'rish uchun GA4 ulangan (`@next/third-parties/google`, `src/app/layout.tsx`).

1. [analytics.google.com](https://analytics.google.com) da yangi GA4 mulk (property) yarating, domen sifatida `fizzo.app`ni kiriting.
2. Olingan o'lchov ID'ni (`G-` bilan boshlanadi) `.env`dagi `NEXT_PUBLIC_GA_MEASUREMENT_ID`ga yozing.
3. Bo'sh qoldirilsa, GA skripti umuman yuklanmaydi (lokal/dev muhitda shunday qoldiring).

> **Muhim:** `NEXT_PUBLIC_*` o'zgaruvchilar Next.js tomonidan **build vaqtida** JS bundle'ga yoziladi, runtime'da emas. Docker orqali deploy qilganda bu qiymat `docker compose --profile prod build app` bosqichida `.env`dan build-arg sifatida o'qiladi (`docker-compose.yml`dagi `app.build.args`) — shuning uchun uni o'zgartirgandan keyin konteynerni qayta ishga tushirish yetarli emas, **qayta build qilish** kerak (4.4-bo'limga qarang).

## 5. VPS'ga joylashtirish (Docker + Nginx)

### 5.1. Serverni tayyorlash

```bash
git clone <repo-url> fizzo && cd fizzo
cp .env.example .env
# .env faylini production qiymatlar bilan to'ldiring:
#   DATABASE_URL — docker-compose'dagi "db" xizmatiga mos (pastga qarang)
#   TELEGRAM_BOT_TOKEN, NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
#   SESSION_SECRET — kamida 32 ta tasodifiy belgi: openssl rand -base64 48
#   ADMIN_TELEGRAM_IDS — vergul bilan ajratilgan Telegram ID'lar
#   DEV_LOGIN="false"
#   NEXT_PUBLIC_GA_MEASUREMENT_ID — ixtiyoriy, 4-bo'limga qarang
```

`docker-compose.yml`dagi `app` xizmati quyidagi muhit o'zgaruvchilarini `.env`dan oladi (`docker compose` ularni avtomatik o'qiydi): `TELEGRAM_BOT_TOKEN`, `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`, `SESSION_SECRET`, `ADMIN_TELEGRAM_IDS`. `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` va `NEXT_PUBLIC_GA_MEASUREMENT_ID` qo'shimcha ravishda build-arg sifatida ham uzatiladi (4-bo'limdagi eslatmaga qarang).

### 5.2. Build va ishga tushirish

```bash
docker compose --profile prod build app
docker compose up -d db
docker compose --profile prod up -d app

# Migratsiyalarni ishga tushirish (birinchi marta va har bir yangi migratsiyadan keyin):
docker compose --profile prod run --rm migrate npx prisma migrate deploy
# Boshlang'ich kontent (ixtiyoriy, birinchi marta):
docker compose --profile prod run --rm migrate npm run db:seed
```

Ilova konteyner ichida `3000`-portda ishlaydi va host'da ham shu portga bog'langan. Agar serverda `3000` band bo'lsa (masalan boshqa loyiha shu portni ishlatayotgan bo'lsa), `.env`da `APP_PORT="..."` qo'shib boshqa portga ko'chirish mumkin — Nginx/Caddy konfiguratsiyasida ham o'sha portni ko'rsating.

### 5.3. Nginx (HTTPS bilan)

Telegram Mini App faqat HTTPS orqali ochiladi, shuning uchun Nginx + Let's Encrypt kerak.

```nginx
server {
    listen 80;
    server_name fizzo.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fizzo.app;

    ssl_certificate     /etc/letsencrypt/live/fizzo.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fizzo.app/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Sertifikat olish uchun (Certbot o'rnatilgan bo'lsa):

```bash
sudo certbot --nginx -d fizzo.app
```

Keyin BotFather'da `/setdomain` va Mini App manzilini `https://fizzo.app` qilib belgilang.

### 5.4. Yangilash

```bash
git pull
docker compose --profile prod build app
docker compose --profile prod run --rm migrate npx prisma migrate deploy
docker compose --profile prod up -d app
```

## 6. Zaxira nusxa (backup)

Postgres ma'lumotlar bazasini har kuni zaxiralash uchun serverda cron sozlang:

```bash
# /usr/local/bin/fizzo-backup.sh
#!/bin/sh
set -e
cd /path/to/fizzo
docker compose exec -T db pg_dump -U fizzo fizzo | gzip > "/var/backups/fizzo/fizzo-$(date +%F).sql.gz"
find /var/backups/fizzo -name "*.sql.gz" -mtime +14 -delete
```

```bash
chmod +x /usr/local/bin/fizzo-backup.sh
mkdir -p /var/backups/fizzo
crontab -e
# har kuni soat 03:00 da:
0 3 * * * /usr/local/bin/fizzo-backup.sh
```

Tiklash uchun:

```bash
gunzip -c /var/backups/fizzo/fizzo-2026-03-05.sql.gz | docker compose exec -T db psql -U fizzo fizzo
```

## 7. Loyiha tuzilishi (qisqacha)

- `src/app/(app)/` — autentifikatsiya talab qiladigan sahifalar (Bugun, Mavzular, Mashq, Mock test, Natijalar).
- `src/app/admin/` — kontent boshqaruv paneli (`ADMIN_TELEGRAM_IDS` talab qiladi).
- `src/app/kirish/` — Telegram orqali kirish sahifasi.
- `src/components/animations/` — parametrik SVG animatsiya shablonlari (`incline`, `atwood`, `table-pulley`) va ularning umumiy pleyeri.
- `src/lib/` — autentifikatsiya, javob tekshirish, seriya (streak), mashq tanlash va mock test mantiqi.
- `prisma/schema.prisma`, `prisma/seed.ts` — ma'lumotlar bazasi sxemasi va boshlang'ich kontent.

## 8. Qamrovdan tashqarida (MVP)

To'lov/Premium, reyting jadvali/XP, video darslar, boshqa fanlar, rus tilidagi interfeys, ishlash vaqtida AI tomonidan yaratiladigan tushuntirishlar.
