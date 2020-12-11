
FROM node:15.3.0-alpine3.10

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package.json ./

# copy source code to /app/src folder
COPY dist /app

COPY .env /app

RUN npm i

RUN ls -l /app

EXPOSE 7777

CMD [ "node", "main.js" ]
