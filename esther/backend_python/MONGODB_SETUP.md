# MongoDB Setup Guide

## ✅ MongoDB Configuration Complete!

Your application has been converted to use MongoDB instead of SQLite.

## 📋 What Changed

1. **Created MongoDB Models** (`mongodb_models.py`)
   - UserDocument, CourseDocument, EnrollmentDocument, etc.
   - All models use Pydantic for validation

2. **Created MongoDB Database Layer** (`mongodb_db.py`)
   - Connection management
   - Collection getters
   - Helper functions for data conversion

3. **Updated Auth Router** (`routers/auth.py`)
   - Now uses async MongoDB operations
   - Signup, login, and refresh endpoints converted

4. **Updated Auth Utils** (`auth_utils.py`)
   - `get_current_user` now uses MongoDB

## 🚀 Setup MongoDB

### Option 1: Install MongoDB Locally

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download for Windows
   - Install it

2. **Start MongoDB:**
   ```powershell
   # MongoDB usually starts automatically as a service on Windows
   # Or start manually:
   mongod --dbpath "C:\data\db"
   ```

3. **Verify MongoDB is running:**
   ```powershell
   mongosh
   # Should connect to MongoDB shell
   ```

### Option 2: Use MongoDB Atlas (Cloud - Free)

1. **Sign up at:** https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get connection string**
4. **Update settings:**
   ```python
   MONGODB_URL = "mongodb+srv://username:password@cluster.mongodb.net/"
   ```

## ⚙️ Configuration

The MongoDB connection is configured in `settings_configuration.py`:

```python
MONGODB_URL: str = "mongodb://localhost:27017"
MONGODB_DATABASE_NAME: str = "inclusive_learning"
```

### To use MongoDB Atlas (cloud):
Create a `.env` file in `backend_python/`:
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE_NAME=inclusive_learning
```

## 🧪 Test MongoDB Connection

```powershell
cd esther
python -c "from backend_python.mongodb_db import get_mongo_client; import asyncio; async def test(): client = get_mongo_client(); await client.admin.command('ping'); print('✅ MongoDB connected!'); asyncio.run(test())"
```

## 📝 Collections Created

When you first use the app, MongoDB will automatically create these collections:
- `users`
- `courses`
- `enrollments`
- `progress`
- `accessibility_settings`
- `quizzes`
- `mentorship_groups`

## 🔄 Migrating from SQLite

If you have existing data in SQLite, you'll need to:
1. Export data from SQLite
2. Import into MongoDB
3. Or start fresh (recommended for development)

## ✅ Next Steps

1. **Install/Start MongoDB** (see above)
2. **Restart your backend server:**
   ```powershell
   python -m uvicorn backend_python.main:app --host 0.0.0.0 --port 8001 --reload
   ```
3. **Test signup** - it will now save to MongoDB!

## 🐛 Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running
- Check the connection string in settings
- Verify MongoDB is accessible on port 27017

**Import errors:**
- Make sure `motor` is installed: `pip install motor`
- Check that all MongoDB files are in place

