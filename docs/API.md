# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

## Predictions Endpoints

### Create Prediction
**POST** `/predictions` (Protected)

Request:
```json
{
  "nations": [
    { "name": "Argentina", "code": "ARG", "rank": 1 },
    { "name": "Brazil", "code": "BRA", "rank": 2 },
    { "name": "France", "code": "FRA", "rank": 3 },
    { "name": "England", "code": "ENG", "rank": 4 },
    { "name": "Germany", "code": "GER", "rank": 5 },
    { "name": "Spain", "code": "SPA", "rank": 6 },
    { "name": "Netherlands", "code": "NED", "rank": 7 },
    { "name": "Belgium", "code": "BEL", "rank": 8 },
    { "name": "Italy", "code": "ITA", "rank": 9 },
    { "name": "Portugal", "code": "POR", "rank": 10 }
  ]
}
```

Response:
```json
{
  "message": "Prediction created successfully",
  "prediction": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "nations": [...],
    "score": 0,
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

### Get My Prediction
**GET** `/predictions/me` (Protected)

Response:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "nations": [...],
  "score": 0
}
```

### Update Prediction
**PUT** `/predictions/:id` (Protected)

Request:
```json
{
  "nations": [
    { "name": "Brazil", "code": "BRA", "rank": 1 },
    ...
  ]
}
```

### Get All Predictions
**GET** `/predictions`

Response:
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "john_doe",
    "nations": [...],
    "score": 45
  },
  ...
]
```

---

## Matches Endpoints

### Create Match
**POST** `/matches`

Request:
```json
{
  "matchId": "arg-bra-001",
  "homeTeam": { "name": "Argentina", "code": "ARG" },
  "awayTeam": { "name": "Brazil", "code": "BRA" },
  "stage": "group",
  "date": "2026-06-15T20:00:00Z"
}
```

### Update Match Result
**PUT** `/matches/:id`

Request:
```json
{
  "homeScore": 2,
  "awayScore": 1,
  "status": "completed"
}
```

### Get All Matches
**GET** `/matches`

### Get Matches by Stage
**GET** `/matches/stage/:stage`

Stages: `group`, `round16`, `quarterfinal`, `semifinal`, `final`

---

## Scores & Leaderboard Endpoints

### Calculate Scores
**POST** `/scores/calculate`

Response:
```json
{
  "message": "Scores calculated",
  "scores": [
    {
      "username": "john_doe",
      "totalScore": 125.5,
      "rank": 1,
      "breakdown": [
        {
          "nationName": "Argentina",
          "nationRank": 1,
          "matchesPlayed": 3,
          "wins": 2,
          "draws": 1,
          "losses": 0,
          "points": 47.5
        },
        ...
      ]
    },
    ...
  ]
}
```

### Get Leaderboard
**GET** `/leaderboard`

Query Parameters:
- `page` (default: 1)
- `limit` (default: 20)

Response:
```json
{
  "leaderboard": [
    {
      "username": "john_doe",
      "totalScore": 125.5,
      "rank": 1
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 48,
    "pages": 3
  }
}
```

### Get Top 10
**GET** `/leaderboard/top10`

Response:
```json
[
  {
    "username": "champion",
    "totalScore": 325.0,
    "rank": 1
  },
  ...
]
```

### Get User Score
**GET** `/scores/user/:userId`

Response:
```json
{
  "username": "john_doe",
  "totalScore": 125.5,
  "rank": 1,
  "breakdown": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Must select exactly 10 nations"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Prediction not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Socket.io Events

### Client to Server
- `join_leaderboard` - Join leaderboard updates
- `watch_match` - Watch specific match

### Server to Client
- `leaderboard_updated` - Leaderboard changed
- `match_updated` - Match result updated
- `match_completed` - Match finished

---

## Rate Limiting

- 100 requests per 15 minutes per IP
- WebSocket connections: unlimited
- File uploads: 5MB max

---

## Example Usage

### JavaScript/Fetch
```javascript
// Register
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'user123',
    email: 'user@example.com',
    password: 'pass123'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);

// Get Leaderboard
const response = await fetch('http://localhost:5000/api/leaderboard');
const leaderboard = await response.json();
```

### cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user123","email":"user@example.com","password":"pass123"}'

# Get Leaderboard
curl http://localhost:5000/api/leaderboard

# Create Prediction (with token)
curl -X POST http://localhost:5000/api/predictions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nations":[...]}'
```

---

For more details, check [DEPLOYMENT.md](./DEPLOYMENT.md)
