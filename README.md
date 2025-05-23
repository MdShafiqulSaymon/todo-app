
# TodoCollaborate API Documentation


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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

## Base URL
```
http://localhost:3001
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

---

## Authentication APIs

### Register User
- **Method:** `POST`
- **URL:** `/auth/register`
- **Request:** Email, password, firstName, lastName
- **Response:** JWT access token and user information

### Login User
- **Method:** `POST`
- **URL:** `/auth/login`
- **Request:** Email and password
- **Response:** JWT access token and user information

### Logout
- **Method:** `POST`
- **URL:** `/auth/logout`
- **Headers:** Authorization Bearer token
- **Response:** Success message

---

## User APIs

### Get User Profile
- **Method:** `GET`
- **URL:** `/users/profile`
- **Headers:** Authorization Bearer token
- **Response:** Current user's profile information

---

## TodoApp APIs

### Create TodoApp
- **Method:** `POST`
- **URL:** `/todo-apps`
- **Headers:** Authorization Bearer token
- **Request:** Name and description
- **Response:** Created TodoApp object with ID, owner, and metadata

### Get All TodoApps
- **Method:** `GET`
- **URL:** `/todo-apps`
- **Headers:** Authorization Bearer token
- **Response:** Array of all TodoApps user has access to

### Get TodoApp by ID
- **Method:** `GET`
- **URL:** `/todo-apps?todoAppId={todoAppId}`
- **Headers:** Authorization Bearer token
- **Response:** Specific TodoApp with collaborators

### Update TodoApp
- **Method:** `PATCH`
- **URL:** `/todo-apps/{todoAppId}`
- **Headers:** Authorization Bearer token
- **Request:** Updated name and/or description
- **Response:** Updated TodoApp object

### Delete TodoApp
- **Method:** `DELETE`
- **URL:** `/todo-apps/{todoAppId}`
- **Headers:** Authorization Bearer token
- **Response:** Deleted TodoApp object

### Add Collaborator
- **Method:** `POST`
- **URL:** `/todo-apps/{todoAppId}/collaborators`
- **Headers:** Authorization Bearer token
- **Request:** Email and role (editor/viewer)
- **Response:** Updated TodoApp with new collaborator

### Remove Collaborator
- **Method:** `DELETE`
- **URL:** `/todo-apps/{todoAppId}/collaborators/{collaboratorId}`
- **Headers:** Authorization Bearer token
- **Response:** Updated TodoApp without removed collaborator

---

## Task APIs

### Create Task
- **Method:** `POST`
- **URL:** `/tasks`
- **Headers:** Authorization Bearer token
- **Request:** Title, description, todoAppId, status, dueDate, priority
- **Response:** Created Task object with ID and metadata

### Get All Tasks for TodoApp
- **Method:** `GET`
- **URL:** `/tasks?todoAppId={todoAppId}`
- **Headers:** Authorization Bearer token
- **Response:** Array of all tasks in specified TodoApp

### Get Task by ID
- **Method:** `GET`
- **URL:** `/tasks/{taskId}`
- **Headers:** Authorization Bearer token
- **Response:** Specific Task object

### Update Task
- **Method:** `PATCH`
- **URL:** `/tasks/{taskId}`
- **Headers:** Authorization Bearer token
- **Request:** Updated title, description, and/or priority
- **Response:** Updated Task object

### Update Task Status
- **Method:** `PATCH`
- **URL:** `/tasks/{taskId}/status`
- **Headers:** Authorization Bearer token
- **Request:** New status (stale/in-progress/completed)
- **Response:** Updated Task with new status

### Delete Task
- **Method:** `DELETE`
- **URL:** `/api/tasks/{taskId}`
- **Headers:** Authorization Bearer token
- **Response:** Deleted Task object

---

## Data Models

### User
- `id`: Unique identifier
- `email`: User email address
- `firstName`: User's first name
- `lastName`: User's last name
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### TodoApp
- `_id`: Unique identifier
- `name`: TodoApp name
- `description`: TodoApp description
- `ownerId`: Owner's user ID
- `collaborators`: Array of collaborator objects with userId and role
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Task
- `_id`: Unique identifier
- `title`: Task title
- `description`: Task description
- `status`: Task status (stale/in-progress/completed)
- `todoAppId`: Parent TodoApp ID
- `createdBy`: Creator's user ID
- `dueDate`: Task due date
- `priority`: Task priority (low/medium/high)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

---

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
