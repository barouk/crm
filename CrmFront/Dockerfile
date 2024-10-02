FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine

# Copy the built Angular app to the Nginx web root
COPY --from=build /app/dist/[project-name] /usr/share/nginx/html


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
