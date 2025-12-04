"""
Script to create an admin user in MongoDB
Run this script to add an administrator account to the database
"""

import asyncio
import sys
from uuid import uuid4
from datetime import datetime
from backend_python.mongodb_db import get_users_collection
from backend_python.mongodb_models import UserDocument, UserRole
from backend_python.auth_utils import get_password_hash

async def create_admin_user():
    """Create an admin user in MongoDB"""
    
    # Admin credentials - CHANGE THESE!
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"  # Change this to a secure password
    ADMIN_NAME = "System Administrator"
    
    users_collection = get_users_collection()
    
    # Check if admin already exists
    existing_admin = await users_collection.find_one({"email": ADMIN_EMAIL})
    if existing_admin:
        print(f"❌ Admin user with email '{ADMIN_EMAIL}' already exists!")
        print("   If you want to update the password, delete the existing user first.")
        return
    
    # Create admin user document
    admin_user = UserDocument(
        id=str(uuid4()),
        email=ADMIN_EMAIL,
        name=ADMIN_NAME,
        role=UserRole.administrator,
        password_hash=get_password_hash(ADMIN_PASSWORD),
        created_at=datetime.utcnow()
    )
    
    # Convert to dict for MongoDB
    user_dict = admin_user.model_dump(by_alias=True, exclude_none=True)
    # MongoDB uses _id, so convert id to _id
    if "id" in user_dict:
        user_dict["_id"] = user_dict.pop("id")
    
    # Insert into MongoDB
    result = await users_collection.insert_one(user_dict)
    
    print("✅ Admin user created successfully!")
    print(f"\n📧 Email: {ADMIN_EMAIL}")
    print(f"🔑 Password: {ADMIN_PASSWORD}")
    print(f"👤 Name: {ADMIN_NAME}")
    print(f"🎭 Role: Administrator")
    print(f"🆔 User ID: {result.inserted_id}")
    print("\n⚠️  IMPORTANT: Change the password after first login!")
    print("   Update ADMIN_PASSWORD in this script for future use.")

if __name__ == "__main__":
    print("🚀 Creating admin user...")
    print("=" * 50)
    try:
        asyncio.run(create_admin_user())
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        sys.exit(1)


