FROM node:12.18.2-stretch AS build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install --quiet
COPY . .
RUN npm run build:ssr


FROM node:12.18.2-stretch
COPY --from=build /app/dist /app/dist
COPY package.json /app
WORKDIR /app
CMD npm start
