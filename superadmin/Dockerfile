FROM node:alpine

WORKDIR /app/superadmin

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3108

CMD ["npm", "start"]