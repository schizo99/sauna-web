FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM node:16-alpine as production-stage
COPY --from=build-stage /app/dist /dist
COPY server.json package.json
COPY server.js ./
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "start"]
