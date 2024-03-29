# Stage 1: Build frontend
FROM node:14-alpine as frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# Stage 2: Build backend
FROM node:14-alpine as backend

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend .

# Stage 3: Combine frontend and backend
FROM node:14-alpine

WORKDIR /app

COPY --from=frontend /app/frontend/dist ./frontend
COPY --from=backend /app/backend .

# Set environment variables
ENV DB_USER=CodeSamuraiP2
ENV DB_PASS=UDmukBd6YOci9AWD
ENV JWT_SECRET=9e513de0d87e487b7e0babd825ba9cebdfbf9a85c54fb9beb3fb04270bfc747c66bf7242b9afac75d0d35474dcd30c39d48ac6f895829f2b0483cdaa46aa0494
ENV EXPIRES_IN=5d
ENV EMAIL=jyotiranmondal@gmail.com
ENV PASSWORD=wfksuxzhbxhloyao

EXPOSE 3000

CMD ["npm", "run", "dev"]
