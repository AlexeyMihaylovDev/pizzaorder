# 🚀 PizzaOrder Backend

Backend API для приложения PizzaOrder на NestJS + Prisma + PostgreSQL.

## 📋 Возможности

- 🔐 JWT аутентификация
- 🍕 CRUD операции для пицц
- 📦 Управление заказами
- 👨‍💼 Админ-панель
- ✅ Валидация данных
- 🗄️ Prisma ORM с PostgreSQL

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Настройка базы данных

1. Создайте файл `.env` на основе `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaorder?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
```

2. Инициализируйте базу данных:

```bash
# Создание миграций
npx prisma migrate dev --name init

# Генерация Prisma Client
npx prisma generate
```

3. (Опционально) Заполните базу тестовыми данными:

```bash
npx prisma db seed
```

### Запуск приложения

```bash
# Режим разработки
npm run start:dev

# Продакшен
npm run build
npm run start:prod
```

Приложение будет доступно по адресу `http://localhost:3000`

## 📡 API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход

### Пиццы (публичные)

- `GET /api/pizzas` - Список всех пицц
- `GET /api/pizzas/:id` - Детали пиццы

### Заказы (требуется авторизация)

- `POST /api/orders` - Создать заказ
- `GET /api/orders` - Список заказов пользователя
- `GET /api/orders/:id` - Детали заказа

### Админ-панель (требуется роль ADMIN)

- `GET /api/admin/orders` - Все заказы
- `PATCH /api/admin/orders/:id` - Изменить статус заказа
- `GET /api/admin/pizzas` - Список пицц
- `POST /api/admin/pizzas` - Создать пиццу
- `PATCH /api/admin/pizzas/:id` - Обновить пиццу
- `DELETE /api/admin/pizzas/:id` - Удалить пиццу

## 🗄️ Структура базы данных

### Модели Prisma

- `User` - Пользователи
- `Pizza` - Пиццы
- `Order` - Заказы
- `OrderItem` - Элементы заказа
- `Address` - Адреса доставки

## 🧪 Тестирование

```bash
# Unit-тесты
npm run test

# E2E-тесты
npm run test:e2e

# Покрытие кода
npm run test:cov
```

## 📝 Примеры запросов

### Регистрация

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

### Вход

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### Создание заказа

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "pizzaId": "pizza-id-1",
        "quantity": 2
      }
    ],
    "address": {
      "street": "Улица Ленина, 1",
      "city": "Москва",
      "zipCode": "101000",
      "country": "Россия"
    }
  }'
```

## 🛠 Технологии

- **NestJS** - Node.js фреймворк
- **Prisma** - ORM
- **PostgreSQL** - База данных
- **JWT** - Аутентификация
- **bcrypt** - Хеширование паролей
- **class-validator** - Валидация
- **class-transformer** - Трансформация данных

## 📝 Лицензия

MIT
