FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production
# RUN npm install # for development

COPY . .

EXPOSE 3500
CMD [ "node", "app.js" ]