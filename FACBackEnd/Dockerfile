FROM node:14

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ARG ACCESS_KEY

ARG SECRET_KEY

ENV AWS_ACCESS_KEY_ID=$ACCESS_KEY

ENV AWS_SECRET_ACCESS_KEY=$SECRET_KEY

CMD [ "node", "src/main.js"]