FROM alpine:3.13

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -silent

COPY . .

EXPOSE 6900
CMD ["npm","run","start"]