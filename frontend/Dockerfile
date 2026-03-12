FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_GRAPHQL_URL=http://localhost:4000
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
