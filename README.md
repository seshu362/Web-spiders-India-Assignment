# Task Management API

This is a Task Management API built using **Node.js**, **Express.js**, and **SQLite3**. The API allows users to manage tasks, supporting CRUD operations (Create, Read, Update, Delete). It also supports filtering, sorting, and pagination for better task management.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [POST /tasks](#post-tasks-create-a-new-task)
  - [GET /tasks](#get-tasks-retrieve-all-tasks)
  - [GET /tasks/:id](#get-tasksid-retrieve-a-specific-task-by-id)
  - [PUT /tasks/:id](#put-tasksid-update-an-existing-task)
  - [DELETE /tasks/:id](#delete-tasksid-delete-a-specific-task)
- [Error Handling](#error-handling)
- [License](#license)

## Installation

1. Install the dependencies:
```bash
   npm install
```
2. Start the Server:
```
node app.js
```

3. Server running on port 3000
   
## Usage
Once the server is running, you can test the API using an API client like Postman or cURL.

## API Endpoints

### 1. Create a New Task
- **Path:** `/tasks`
- **Method:** `POST`
- **Request body:**
  ```json
  {
    "title": "New Task",
    "description": "This is a description for the new task",
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2024-12-15T12:00:00"
  }
- **Response:**
  ```json
  {
    "id": 1
  }
### 2. Retrieve All Tasks
- **Path:** `/tasks`
- **Method:** `GET`
- **Query Parameters:**
  - status (optional): Filter tasks by status (e.g., TODO, IN_PROGRESS, COMPLETED).
  - priority (optional): Filter tasks by priority (e.g., LOW, MEDIUM, HIGH).
  - sort (optional): Sort tasks by a field (createdAt, updatedAt, etc.).
  - order (optional): Sort order (asc, desc).
  - limit (optional): Number of tasks to return per page (default: 10).
  - skip (optional): Number of tasks to skip (default: 0).

- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "New Task",
      "description": "This is a description for the new task",
      "status": "TODO",
      "priority": "MEDIUM",
      "dueDate": "2024-12-15T12:00:00",
      "createdAt": "2024-12-01T12:00:00",
      "updatedAt": "2024-12-01T12:00:00"
    }
  ]
### 3. Retrieve a Specific Task by ID
- **Path:** `/tasks/:id`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "id": 1,
    "title": "New Task",
    "description": "This is a description for the new task",
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2024-12-15T12:00:00",
    "createdAt": "2024-12-01T12:00:00",
    "updatedAt": "2024-12-01T12:00:00"
  }
### 4. Update an Existing Task
- **Path:** `/tasks/:id`
- **Method:** `PUT`
- **Request body:**
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description for the task",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2024-12-20T12:00:00"
  }

- **Response:**
  ```json
  {
    "message": "Task updated successfully"
  }  

 ### 5. Delete a Specific Task
- **Path:** `/tasks/:id`
- **Method:** `DELETE`
- **Response:**
  ```json
  {}
  
 - **Success:** `Returns a 204 No Content indicating the task was successfully deleted.`
 - **Error:** `Returns a 404 Not Found if the task with the specified ID does not exist.`

## Error Handling  
The API includes basic error handling. Common errors include:
  - **400 Bad Request:** ` Invalid input or missing required fields.`
  - **404 Not Found:** `Task not found for a specific ID.`
  - **500 Internal Server Error:** `Unexpected server error.`
  - **Sample Error Response:**
      ```json
      {
        "error": "Task not found"
      }
