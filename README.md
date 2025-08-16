# SHAY_SHOP

This is a full-stack MERN (MongoDB, Express.js, React, Node.js) application for a hotel booking system.

## Project Structure

The project is divided into two main parts: `client` and `server`.

### Client

Located in the `client/` directory, this is a React application built with Create React App. It provides the user interface for booking rooms, viewing available rooms, user authentication, and administrative functionalities.

**Key Technologies:**
- React
- React Router
- Axios (for API calls)
- Ant Design (for UI components - assuming based on common MERN stack practices, please adjust if different)

#### Setup and Run (Client)

To set up and run the client application:

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The client application will typically run on `http://localhost:3000`.

### Server

Located in the `server/` directory, this is a Node.js and Express.js backend application that handles API requests, database interactions, and business logic. It includes routes for user management, room management, booking management, and payment processing.

**Key Technologies:**
- Node.js
- Express.js
- Mongoose (for MongoDB ORM - assuming based on MERN stack, please adjust if PostgreSQL is used for `databasepg.js`)
- Nodemon (for development, auto-restarts server)

#### Setup and Run (Server)

To set up and run the server application:

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your environment variables (e.g., MongoDB URI, JWT Secret). Example:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will typically run on `http://localhost:5000`.

## API Endpoints (Conceptual)

- **User Authentication:** `/api/users/register`, `/api/users/login`
- **Room Management:** `/api/rooms/getallrooms`, `/api/rooms/getroombyid/:roomid`
- **Booking Management:** `/api/bookings/bookroom`, `/api/bookings/getbookingsbyuserid/:userid`
- **Admin Functionality:** `/api/admin/users`, `/api/admin/rooms`, `/api/admin/bookings`
- **Payment Processing:** `/api/payment/makepayment`

## Database

The project uses a database for storing user, room, and booking information. Based on the file structure, it appears there are options for both MongoDB (common for MERN) and PostgreSQL.

- `db.js`: Likely for MongoDB connection.
- `databasepg.js`: Likely for PostgreSQL connection.

**Please ensure your database is running and accessible before starting the server.**

## Contributing

(Add details on how others can contribute to your project)

## License

(Add your project's license information)
