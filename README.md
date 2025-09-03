# Express MongoDB Server

A simple Node.js Express server with MongoDB integration, featuring user authentication and user management.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- User profile management
- Admin user management
- MongoDB integration with Mongoose
- Input validation
- Error handling
- CORS support

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the development server:

```bash
npm run dev
```

Or start the production server:

```bash
npm start
```

## API Endpoints

### Authentication Routes

#### Register User

- **POST** `/api/auth/register`
- **Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User

- **POST** `/api/auth/login`
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Routes (Protected)

#### Get User Profile

- **GET** `/api/users/profile`
- **Headers:** `Authorization: Bearer <token>`

#### Update User Profile

- **PUT** `/api/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith"
}
```

### Admin Routes (Admin Only)

#### Get All Users

- **GET** `/api/users`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Query Parameters:** `page`, `limit`

#### Get User by ID

- **GET** `/api/users/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

#### Toggle User Status

- **PUT** `/api/users/:id/toggle-status`
- **Headers:** `Authorization: Bearer <admin_token>`

## Project Structure

```
server/
├── models/
│   └── User.js          # User model with Mongoose schema
├── routes/
│   ├── auth.js          # Authentication routes
│   └── users.js         # User management routes
├── middleware/
│   └── auth.js          # Authentication middleware
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Node.js dependencies
├── server.js           # Main server file
└── README.md           # This file
```

## Testing with curl

### Register a new user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get profile (replace TOKEN with actual token):

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment mode (development/production)

## Security Features

- Password hashing using bcryptjs
- JWT token authentication
- Input validation using express-validator
- CORS protection
- Error handling middleware
- MongoDB injection protection through Mongoose

## Development

For development with auto-restart on file changes:

```bash
npm run dev
```

## License

ISC
