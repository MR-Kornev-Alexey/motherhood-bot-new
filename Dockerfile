FROM node:20-alpine

WORKDIR /app

# Сначала копируем только файлы для установки зависимостей
COPY package.json package-lock.json* yarn.lock* ./

# Умная установка зависимостей
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install; fi

# Копируем остальные файлы
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

CMD ["npm", "start"]
