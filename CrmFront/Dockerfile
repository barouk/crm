FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod
EXPOSE 4200

FROM nginx:alpine
COPY --from=build /app/dist/uni-proj-alireza-bgh /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
