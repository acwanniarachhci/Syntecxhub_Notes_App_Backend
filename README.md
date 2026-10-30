# Syntecxhub Notes App Backend

A REST API for a notes app with user accounts, owner-only access, archive and soft-delete, built with Node.js, Express, MongoDB (Mongoose) and JWT.
Created as part of the Syntecxhub Back-End Development Internship (Week 3, Project 1).

## Features

- Signup and login with bcrypt password hashing and JWT
- Users and Notes collections; each note references its owner (`ref: "User"`)
- Full CRUD for notes, accessible only by the note's owner
- Mongoose `populate`: fetch a user with their notes (virtual populate) and a note with its user
- List all of a user's notes and fetch a single note
- Archive / unarchive notes
- Soft-delete (trash) and restore notes
- Filtering by category, archived and deleted state

## Tech Stack

Node.js, Express, MongoDB + Mongoose, bcryptjs, jsonwebtoken, dotenv

## Getting Started

1. Clone the repo and run `npm install`
2. Create a `.env` file:

PORT=5004
MONGO_URI=mongodb://127.0.0.1:27017/syntecxhub_notes
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1h

3. Run `npm run dev`

## API Endpoints

| Method | Endpoint                  | Auth   | Description                          |
|--------|---------------------------|--------|--------------------------------------|
| POST   | /api/auth/signup          | No     | Register a new user                  |
| POST   | /api/auth/login           | No     | Login and receive a JWT              |
| GET    | /api/users/me             | Bearer | Current user with their notes        |
| POST   | /api/notes                | Bearer | Create a note                        |
| GET    | /api/notes                | Bearer | List my notes                        |
| GET    | /api/notes/:id            | Bearer | Get one note (owner only)            |
| PUT    | /api/notes/:id            | Bearer | Update a note (owner only)           |
| PATCH  | /api/notes/:id/archive    | Bearer | Archive / unarchive a note           |
| DELETE | /api/notes/:id            | Bearer | Soft-delete a note                   |
| PATCH  | /api/notes/:id/restore    | Bearer | Restore a soft-deleted note          |

### Query parameters (GET /api/notes)

| Param    | Example            | Description                     |
|----------|--------------------|---------------------------------|
| archived | `?archived=true`   | Show archived notes             |
| deleted  | `?deleted=true`    | Show soft-deleted notes (trash) |
| category | `?category=work`   | Filter by category              |

## Status Codes

| Code | Meaning                                              |
|------|------------------------------------------------------|
| 200  | Success                                              |
| 201  | Created                                              |
| 400  | Validation error / invalid ID                        |
| 401  | Missing, invalid or expired token                    |
| 404  | Note not found (also returned for other users' notes)|
| 409  | Username or email already exists                     |
| 500  | Server error                                         |

## Screenshots
Screenshot 2026-10-29 172131.png
Screenshot 2026-10-29 172154.png
Screenshot 2026-10-29 172258.png
Screenshot 2026-10-29 172346.png
Screenshot 2026-10-29 173944.png
Screenshot 2026-10-29 174034.png
Screenshot 2026-10-29 174153.png
Screenshot 2026-10-29 180552.png

## Author

Amandi Wanniarachchi