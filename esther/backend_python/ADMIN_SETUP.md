# Admin User Setup Guide

This guide explains how to create an administrator user in MongoDB for the Inclusive Learning Platform.

## Method 1: Using Python Script (Recommended)

### Step 1: Navigate to backend directory
```bash
cd esther/backend_python
```

### Step 2: Run the admin creation script
```bash
python create_admin_simple.py
```

### Step 3: Default Admin Credentials
The script will create an admin user with:
- **Email:** `admin@inclusivelearning.com`
- **Password:** `Admin123!`
- **Role:** `administrator`

### Step 4: Customize Credentials (Optional)
Edit `create_admin_simple.py` and change these variables:
```python
ADMIN_EMAIL = "your-admin@email.com"
ADMIN_PASSWORD = "YourSecurePassword123!"
ADMIN_NAME = "Your Admin Name"
```

## Method 2: Using MongoDB Shell

If you have direct access to MongoDB, you can create the admin user directly:

```javascript
// Connect to MongoDB
use inclusive_learning

// Create admin user
db.users.insertOne({
  _id: ObjectId().toString(),
  email: "admin@inclusivelearning.com",
  name: "System Administrator",
  role: "administrator",
  password_hash: "<hashed_password>",  // Use Python script to generate hash
  created_at: new Date()
})
```

**Note:** You need to hash the password first. Use the Python script for this.

## Method 3: Using Python Interactive Shell

```python
from backend_python.mongodb_db import get_users_collection
from backend_python.mongodb_models import UserDocument, UserRole
from backend_python.auth_utils import get_password_hash
import asyncio
from uuid import uuid4
from datetime import datetime

async def create_admin():
    users_collection = get_users_collection()
    
    admin = UserDocument(
        id=str(uuid4()),
        email="admin@inclusivelearning.com",
        name="System Administrator",
        role=UserRole.administrator,
        password_hash=get_password_hash("Admin123!"),
        created_at=datetime.utcnow()
    )
    
    user_dict = admin.model_dump(by_alias=True, exclude_none=True)
    if "id" in user_dict:
        user_dict["_id"] = user_dict.pop("id")
    
    result = await users_collection.insert_one(user_dict)
    print(f"Admin created with ID: {result.inserted_id}")

asyncio.run(create_admin())
```

## Verification

After creating the admin user, verify it was created:

1. **Check MongoDB:**
   ```javascript
   db.users.findOne({ role: "administrator" })
   ```

2. **Test Login:**
   - Go to your frontend login page
   - Login with admin credentials
   - You should be redirected to `/admin/dashboard`

## Security Notes

⚠️ **IMPORTANT:**
1. Change the default password immediately after first login
2. Use a strong password (min 8 characters, mix of letters, numbers, symbols)
3. Don't commit admin credentials to version control
4. Consider using environment variables for admin credentials in production

## Troubleshooting

### Error: "Admin user already exists"
- The email is already in use
- Either delete the existing user or use a different email
- To update password, edit the script to update instead of insert

### Error: "MongoDB connection failed"
- Check your `MONGODB_URL` in `.env` or environment variables
- Ensure MongoDB is running and accessible
- Verify network connectivity

### Error: "Module not found"
- Make sure you're in the `esther/backend_python` directory
- Install dependencies: `pip install -r requirements.txt`
- Check Python path includes the backend directory

## Default Admin Credentials

**For Development:**
- Email: `admin@inclusivelearning.com`
- Password: `Admin123!`

**⚠️ Change these in production!**


