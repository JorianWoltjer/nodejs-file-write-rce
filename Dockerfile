FROM node:22.9.0

WORKDIR /app
COPY app/package.json package.json
RUN npm install
COPY app/main.js main.js

CMD node main.js
