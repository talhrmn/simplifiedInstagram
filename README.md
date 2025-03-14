# Simplified Instagram

A simple web app where you can browse 100 images, like or dislike them, and export your votes as a CSV file. Votes are saved persistently, and updates happen in real time.

## Tech Stack

### Backend: FastAPI
- Great performance and easy integration with Pydantic
- Automatic API documentation with Swagger UI
- Modern Python features with built-in type checking

### Frontend: React with TypeScript
- Component-based structure for clean and reusable code
- TypeScript for safer and more predictable development
- Built with Next.js for better performance and server-side rendering

### Database: Redis
- Super fast in-memory storage
- Handles vote counts efficiently with atomic operations
- Simple and lightweight, perfect for this project

## Features

- Grid view of 100 images from Lorem Picsum
- Like/dislike buttons for each image
- Real-time vote updates using Server-Sent Events (SSE)
- Export votes as a CSV file

### Why SSE for Real-Time Updates?
SSE is a great fit for this project because:
- It’s efficient for one-way updates from the server to the client
- Auto-reconnects if the connection drops
- Works natively in browsers without extra dependencies
- Uses standard HTTP, making it easy to work with proxies and load balancers

### Why Next.js?
- Optimized performance with automatic code splitting and server-side rendering
- Simple routing and built-in API routes
- Developer-friendly features like hot reloading and TypeScript support

### Why Redis?
Redis is the best choice for this project because it’s fast and simple. If the app needed user accounts or complex relationships, a relational database like PostgreSQL would be better. But for a quick and efficient voting system, Redis is ideal.

## Running the App

### Prerequisites
- Docker and Docker Compose installed
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/image-voting-app.git
   ```

2. Start the app:
   ```bash
   docker-compose up --build
   ```

3. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Docker Setup
The app runs in three containers:
1. **Database** – Redis for storing votes
2. **Server** – FastAPI backend
3. **Client** – Next.js frontend

### How to Use
- Browse the image grid
- Click thumbs up/down to like or dislike images
- See vote counts update instantly
- Export votes as a CSV file with one click

### Tests
- There are a number of tests you can run
- BE: Test files located in the test dir. Run using pytest.
- FE: Test files can be run using npm test
