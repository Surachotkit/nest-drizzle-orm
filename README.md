# nest-drizzleorm

โปรเจคสำหรับเรียนรู้ [NestJS](https://nestjs.com) ร่วมกับ [Drizzle ORM](https://orm.drizzle.team) และ PostgreSQL มีตัวอย่าง CRUD ของ `users`

## Tech stack

- NestJS 12 (ESM)
- Drizzle ORM + `@nestjs/drizzle` + `drizzle-kit`
- PostgreSQL 17 (รันผ่าน Docker)
- Zod สำหรับ validate request (`StandardSchemaValidationPipe`)
- `@nestjs/config` สำหรับอ่านค่า `.env`

## ความต้องการ

- Node.js 24+
- Docker

## เริ่มใช้งาน

```bash
# 1. ติดตั้ง dependencies
npm install --legacy-peer-deps

# 2. ตั้งค่า environment
cp .env.example .env

# 3. เริ่ม PostgreSQL (พอร์ต 5433)
npm run db:up

# 4. สร้างตารางด้วย migration
npm run db:migrate

# 5. รันแอป
npm run start:dev
```

แอปจะรันที่ http://localhost:3000

> ใช้ `--legacy-peer-deps` เพราะ `npm install` ปกติอาจล้มด้วยบั๊กของ npm (`Cannot read properties of null (reading 'edgesOut')`)
>
> Postgres ใน Docker ใช้พอร์ต **5433** เพื่อไม่ชนกับ Postgres ที่อาจรันอยู่ในเครื่องที่พอร์ต 5432

## Environment variables

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5433/nest_drizzle` | connection string ของ PostgreSQL |
| `PORT` | `3000` | พอร์ตของแอป (ไม่บังคับ) |

## Scripts

| คำสั่ง | หน้าที่ |
|---|---|
| `npm run start:dev` | รันแบบ watch mode |
| `npm run build` | build เป็น `dist/` |
| `npm run start:prod` | รันจาก `dist/` |
| `npm run db:up` | เริ่ม PostgreSQL ด้วย Docker Compose |
| `npm run db:generate` | สร้างไฟล์ migration จากการเปลี่ยนแปลงใน `schema.ts` |
| `npm run db:migrate` | รัน migration กับฐานข้อมูล |
| `npm run db:studio` | เปิด Drizzle Studio (UI ดูข้อมูล) |
| `npm run lint` | ตรวจโค้ดด้วย oxlint |
| `npm run format` | จัดรูปแบบโค้ดด้วย prettier |

## API

| Method | Path | คำอธิบาย |
|---|---|---|
| `GET` | `/users` | รายการ users ทั้งหมด |
| `GET` | `/users/:id` | ดู user ตาม id |
| `POST` | `/users` | สร้าง user |
| `PATCH` | `/users/:id` | แก้ไข user (ส่งเฉพาะ field ที่ต้องการแก้) |
| `DELETE` | `/users/:id` | ลบ user |

ตัวอย่าง:

```bash
curl -X POST localhost:3000/users \
  -H 'content-type: application/json' \
  -d '{"name":"John Doe","email":"JohnDoe@example.com"}'

curl localhost:3000/users

curl -X PATCH localhost:3000/users/1 \
  -H 'content-type: application/json' \
  -d '{"isActive":false}'

curl -X DELETE localhost:3000/users/1
```

ข้อมูลที่ไม่ผ่านการ validate จะได้ `400` และถ้าไม่พบ id จะได้ `404`

## โครงสร้างโปรเจค

```
.
├── docker-compose.yml      # PostgreSQL
├── drizzle.config.ts       # ตั้งค่า drizzle-kit
├── drizzle/                # ไฟล์ SQL migration (generate อัตโนมัติ)
└── src/
    ├── main.ts             # bootstrap + global validation pipe
    ├── app.module.ts       # ConfigModule + DrizzleModule
    ├── db/
    │   └── schema.ts       # นิยามตารางด้วย pgTable
    └── users/
        ├── users.module.ts
        ├── users.controller.ts
        ├── users.service.ts     # query ผ่าน Drizzle
        └── users.schemas.ts     # Zod schemas
```

## แก้ schema และสร้าง migration

1. แก้ตารางใน `src/db/schema.ts`
2. `npm run db:generate` เพื่อสร้างไฟล์ migration ใหม่ใน `drizzle/`
3. `npm run db:migrate` เพื่อนำไปใช้กับฐานข้อมูล

## เอกสารอ้างอิง

- [NestJS + Drizzle](https://docs.nestjs.com/data/drizzle)
- [NestJS Validation](https://docs.nestjs.com/application/validation)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
