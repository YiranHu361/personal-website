# Wordle Solver Backend

A Spring Boot REST API that provides intelligent Wordle solving capabilities.

## Features

- **Intelligent Word Filtering**: Uses advanced algorithms to filter possible words based on hints
- **Hint Processing**: Supports grey (-), yellow (x), and green (letter) hint formats
- **RESTful API**: Clean REST endpoints for easy integration
- **CORS Support**: Configured for frontend integration

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Running the Application

1. **Navigate to the backend directory:**

   ```bash
   cd wordle-backend
   ```

2. **Build the application:**

   ```bash
   mvn clean install
   ```

3. **Run the application:**

   ```bash
   mvn spring-boot:run
   ```

4. **Verify the application is running:**
   ```bash
   curl http://localhost:8080/api/wordle/health
   ```

## API Endpoints

### POST /api/wordle/solve

Solves a Wordle puzzle based on word and hints.

**Request Body:**

```json
{
  "word": "soare",
  "hints": "- e - - x"
}
```

**Response:**

```json
{
  "suggestions": ["until", "uncle", "under"],
  "message": "Found 3 possible words",
  "success": true
}
```

### GET /api/wordle/health

Health check endpoint.

**Response:**

```
Wordle Solver API is running!
```

## Hint Format

- **-** (dash): Grey - letter not in word
- **x**: Yellow - letter in word but wrong position
- **letter**: Green - correct letter in correct position

**Example:** For word "hello" with hints "- e - - x", the format is: `- e - - x`

## Integration with Frontend

The backend is configured to accept requests from `http://localhost:3000` (your Next.js frontend). Make sure both applications are running:

1. Backend: `http://localhost:8080`
2. Frontend: `http://localhost:3000`

## Algorithm Details

The solver uses a sophisticated filtering algorithm:

1. **Exclusion Filtering**: Removes words containing grey letters
2. **Position Filtering**: Ensures correct letters are in correct positions
3. **Wrong Position Filtering**: Ensures yellow letters exist but not in wrong positions
4. **Ranking**: Returns top suggestions sorted alphabetically

## Development

To modify the word list or algorithm, edit the `WordleSolver.java` service class.

## Deployment

For production deployment, consider:

- Using a proper database for word storage
- Adding authentication if needed
- Configuring proper CORS origins
- Adding rate limiting
- Using HTTPS
