# Project Setup Guide

## Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MySQL Database
  - Name: `erp_db`
  - Credentials: Configure in `backend/.env`

## Project Structure
- `backend`: NestJS Application
- `frontend`: React Vite Application

## Installation

1. Install all dependencies from root:
   ```bash
   npm install
   npm run install:all
   ```

2. Configure Environment:
   - Check `backend/.env` and update MySQL credentials if needed.

## Running the Application

Start both Backend and Frontend with a single command:
```bash
npm start
```
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Authentication
- **Register**: `/auth/register`
- **Login**: `/auth/login`
