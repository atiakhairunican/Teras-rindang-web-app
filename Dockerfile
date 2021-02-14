FROM node:14.15.4-slim

RUN mkdir -p /usr/sampleapp

WORKDIR /usr/sampleapp

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 9000

CMD ["node", "app.js"]