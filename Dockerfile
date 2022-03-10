FROM node:16.13-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm","run", "start.dev"]
