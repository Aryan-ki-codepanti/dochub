# DocHub - collaborative platform

DocHub is a real-time Collaborative Workspace Platform where users can chat, video call, share files, and collaborate in virtual rooms. The system should support high traffic, ensure scalability, and include core functionalities of real-time interaction and multi-user collaboration.

## Folder Structure

```
root
├── frontend
└── backend
```

### Frontend

The `frontend` folder contains the React-based user interface for DocHub.

### Backend

The `backend` folder contains the Node.js server that handles API requests, authentication, and database operations.

---

## Setup Instructions

### Prerequisites

1. **Node.js and npm**: Ensure that Node.js (>=14.x) and npm (>=6.x) are installed on your machine.
2. **Database**: Set up MongoDB (local or cloud instance, e.g., MongoDB Atlas).

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dochub
```

### 2. Backend Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create a `.env` file in the root folder with the following variables:

    ```env
    NODE_ENV=yourReactAppPort
    PORT=yourbackendport
    MONGO_URI=your_mongo_database_uri
    JWT_SECRET=your_jwt_secret
    REACT_APP_PORT=yourReactAppPort
    ```

3. Start the server:
    ```bash
    npm run server
    ```
    The backend server should now be running at `http://localhost:yourbackendport`.

### 3. Frontend Setup

1. Navigate to the frontend folder:

    ```bash
    cd ./frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` folder with the following variables:

    ```env
    REACT_APP_PORT=port
    ```

4. Start the development server:
    ```bash
    npm run client
    ```
    The frontend application should now be running at `http://localhost:reactport`.

---

## Additional Notes

### Environment Variables

-   Ensure all sensitive credentials like `MONGO_URI`, `JWT_SECRET`, and Cloudinary keys are stored securely and not committed to the repository.
-   Use a `.env` file or environment variable management tools for production deployments.

### Installations

-   **Backend Dependencies**: Express, Mongoose, dotenv, bcryptjs, jsonwebtoken, etc.
-   **Frontend Dependencies**: React, Axios, React Router, Redux Toolkit , bootstrap etc., etc.

### Running in Production

1. Build the frontend for production:
    ```bash
    cd frontend
    npm run build
    ```
2. Serve the built frontend with the backend using a static file server.

---
