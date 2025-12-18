<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

 
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

---

# Blog & Post Management System

A fully-featured **Blog & Post Management System** built with **NestJS**, **TypeORM**, **PostgreSQL**, **Redis**, and **BullMQ**. This project demonstrates modern backend architecture with **role-based access control (RBAC)**, caching, file uploads, queue-based background processing, and RESTful API design.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture Overview](#architecture-overview)
* [Folder Structure](#folder-structure)
* [Modules & Functionality](#modules--functionality)

  * [Users Module](#users-module)
  * [Posts Module](#posts-module)
  * [Comments Module](#comments-module)
  * [Categories Module](#categories-module)
  * [Permissions Module](#permissions-module)
  * [Common Module](#common-module)
* [Caching & Queue](#caching--queue)
* [Database Schema](#database-schema)
* [Authentication & Authorization](#authentication--authorization)
* [File Upload Handling](#file-upload-handling)
* [Pagination & Search](#pagination--search)
* [Development Setup](#development-setup)
* [Running the Project](#running-the-project)
* [API Documentation](#api-documentation)
* [Notes & Best Practices](#notes--best-practices)

---

## Features

* User registration & JWT authentication
* Role-based access control (Admin / User)
* CRUD operations for posts, categories, and comments
* File uploads for posts with Multer & disk storage
* Background file processing with **BullMQ queues**
* Caching with **Redis** for faster reads
* Pagination and search functionality
* Detailed API responses using **DTOs** and class serialization
* Strict TypeScript setup with `tsconfig` configurations

---

## Tech Stack

* **Backend Framework:** NestJS
* **Database:** PostgreSQL (via TypeORM)
* **Caching:** Redis (cache-manager-ioredis-yet)
* **Background Jobs:** BullMQ
* **Validation:** class-validator & class-transformer
* **Authentication:** JWT via Passport
* **File Uploads:** Multer
* **API Documentation:** Swagger
* **Language:** TypeScript
* **Build Tools:** tsconfig.json / tsconfig.build.json

---

## Architecture Overview

The project follows a **modular architecture**:

1. **Modules**: Each feature (Users, Posts, Comments, Categories, Permissions) is a separate NestJS module.
2. **Controllers**: Handle HTTP requests and responses.
3. **Services**: Contain business logic and interact with database & cache.
4. **Entities**: Represent database tables using TypeORM.
5. **DTOs**: Data Transfer Objects enforce validation and response formatting.
6. **Guards & Decorators**: Implement role-based permissions and JWT authentication.
7. **Interceptors**: Transform API responses globally.
8. **Middleware**: Logs HTTP requests.

---

## Folder Structure

```
src/
├─ common/                 # Global middleware, guards, decorators, interceptors
├─ users/                  # User management module
├─ posts/                  # Post management with attachments & background processing
├─ comments/               # Comments management module
├─ category/               # Category management module
├─ permissions/            # Role-based permission management
├─ redis.module.ts         # Global Redis cache configuration
├─ main.ts                 # Entry point of the application
├─ tsconfig.json           # Base TypeScript config
├─ tsconfig.build.json     # Production TypeScript build config
```

---

## Modules & Functionality

### Users Module

* **Entity**: Stores user data with `id`, `name`, `email`, `password`, `role`.
* **Roles**: `USER` and `ADMIN`.
* **Service**: Handles CRUD and role changes.
* **DTOs**: Validate input and control output fields.

### Posts Module

* **Entity**: `Post` entity with `title`, `content`, `author`, `category`, `attachments`.
* **CRUD**: Create, read, update, delete posts.
* **File Upload**: Users can upload multiple attachments per post.
* **Background Queue**: Uses BullMQ for async attachment processing.
* **Caching**: Frequently accessed posts are cached in Redis.
* **Pagination & Search**: Query parameters for page, limit, and search.

### Comments Module

* **Entity**: `Comment` linked to `Post` and `User`.
* **CRUD**: Users can create, update, delete comments.
* **Authorization**: Only comment owners or admins can modify/delete.

### Categories Module

* **Entity**: `Category` with `name` and `description`.
* **CRUD**: Create, read, update, delete categories.
* **Relations**: Categories can have multiple posts.

### Permissions Module

* **Enums**: `Permission` enum defines all possible actions.
* **RBAC**: `ROLE_PERMISSIONS` map associates roles with allowed permissions.
* **Cache**: Permissions are cached in Redis for fast access.
* **Guards**: `PermissionsGuard` ensures route-level access control.

### Common Module

* **JwtAuthGuard**: Skips authentication for public routes.
* **RolesGuard**: Validates user roles using custom decorators.
* **Public Decorator**: Marks endpoints as public.
* **Logger Middleware**: Logs all HTTP requests.
* **Response Interceptor**: Wraps responses with `{ success, data }`.
* **Multer Config**: Handles disk storage for file uploads.

---

## Caching & Queue

* **Redis**: Caches posts, permissions, and frequently accessed data.
* **BullMQ**: Handles background tasks like file processing for uploaded attachments.
* **Benefits**:

  * Reduces DB load
  * Improves API response time
  * Handles heavy async tasks without blocking requests

---

## Database Schema

* **User**: `id, name, email, password, role`
* **Post**: `id, title, content, attachments, authorId, categoryId`
* **Comment**: `id, text, postId, userId`
* **Category**: `id, name, description`

Relationships:

* User → Post (One-to-Many)
* Post → Comment (One-to-Many)
* Category → Post (One-to-Many)
* User → Comment (One-to-Many)

---

## Authentication & Authorization

* **JWT**: Users authenticate with email/password and receive JWT token.
* **Role-Based Access**: Admins have full access; Users have restricted actions.
* **Decorators & Guards**:

  * `@Permissions()` for action-level access
  * `@Roles()` for role-level access

---

## File Upload Handling

* **Multer Disk Storage**: Files saved in `uploads/posts/`
* **Unique Filenames**: Combines timestamp + random number + original extension
* **Validation**: Maximum file size = 2MB
* **Queue Processing**: After upload, files are processed asynchronously and DB is updated.

---

## Pagination & Search

* **Posts Endpoint** supports:

  * `page`: Page number (default = 1)
  * `limit`: Number of posts per page (default = 10)
  * `search`: Search term on `title` or `content`
* **Redis caching** ensures fast repeated queries.

---

## Development Setup

```bash
# Clone repository
git clone <repo-url>
cd <project-folder>

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set DB credentials, Redis host/port, JWT secret

# Run DB migrations (if any)
npm run typeorm:migrate

# Start development server
npm run start:dev
```

---

## Running the Project

* **Development:** `npm run start:dev`
* **Production build:** `npm run build && npm run start:prod`
* **Queue Worker:** BullMQ is integrated into the app and runs automatically with NestJS

---

## API Documentation

* Swagger UI is available at: `http://localhost:3000/api`
* All endpoints are documented with request/response DTOs.
* Includes authentication, file uploads, pagination, and RBAC usage examples.

---
