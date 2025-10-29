# Form Submission App - Setup Guide

## 📋 Project Structure

```
starter/
├── client/              # Frontend files
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server/              # Backend files
│   ├── server.js
│   └── db/
│       └── connection.js
├── .env.example         # Environment template
├── .gitignore
└── package.json
```

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Install PostgreSQL

1. Go to https://www.postgresql.org/download/windows/
2. Download and install PostgreSQL
3. During installation:
   - Set a password for the postgres user
   - Default port: 5432
   - Install pgAdmin (GUI tool)

### Step 3: Create Database

1. Open pgAdmin or use psql command line
2. Create a new database:

```sql
CREATE DATABASE form_submissions;
```

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env` file with your database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=form_submissions
PORT=3000
```

### Step 5: Start the Application

```bash
npm run dev
```

### Step 6: Test the Application

1. Open your browser and go to: http://localhost:3000
2. Fill out the form and submit
3. Check for toast notifications
4. Click "View All Submissions" to see saved data

## 🧪 Testing the API

### Using curl:

```bash
# Submit form
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message"}'

# Get all submissions
curl http://localhost:3000/api/submissions

# Health check
curl http://localhost:3000/api/health
```

## 🔧 Troubleshooting

### Database connection issues:

- Make sure PostgreSQL is running
- Verify credentials in `.env` file
- Check if port 5432 is available

### Port already in use:

- Change PORT in `.env` to a different number (e.g., 3001)
- Update API_URL in `client/script.js` accordingly

### CORS errors:

- Make sure the backend server is running
- Check browser console for specific errors

## 📦 Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **dotenv**: Environment variable management
- **cors**: Enable Cross-Origin Resource Sharing
- **nodemon**: Auto-restart server
