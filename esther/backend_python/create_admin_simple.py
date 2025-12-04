"""
Simple script to create admin user - can be run directly
Alternative to create_admin.py if you prefer synchronous code
"""

import sys
import os
from uuid import uuid4
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from backend_python.settings_configuration import settings
from backend_python.auth_utils import get_password_hash
from backend_python.mongodb_models import UserRole

async def main():
    # Admin credentials - CHANGE THESE!
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"  # Change this to a secure password
    ADMIN_NAME = "System Administrator"
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DATABASE_NAME]
    users_collection = db["users"]
    
    # Check if admin already exists
    existing = await users_collection.find_one({"email": ADMIN_EMAIL})
    if existing:
        print(f"❌ Admin user with email '{ADMIN_EMAIL}' already exists!")
        response = input("Do you want to update the password? (y/n): ")
        if response.lower() == 'y':
            new_hash = get_password_hash(ADMIN_PASSWORD)
            await users_collection.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {"password_hash": new_hash, "role": "administrator"}}
            )
            print("✅ Admin password updated!")
        else:
            print("Cancelled.")
        client.close()
        return
    
    # Create admin user
    admin_user = {
        "_id": str(uuid4()),
        "email": ADMIN_EMAIL,
        "name": ADMIN_NAME,
        "role": "administrator",
        "password_hash": get_password_hash(ADMIN_PASSWORD),
        "created_at": datetime.utcnow()
    }
    
    # Insert into MongoDB
    result = await users_collection.insert_one(admin_user)
    
    print("=" * 60)
    print("✅ Admin user created successfully!")
    print("=" * 60)
    print(f"📧 Email:    {ADMIN_EMAIL}")
    print(f"🔑 Password: {ADMIN_PASSWORD}")
    print(f"👤 Name:     {ADMIN_NAME}")
    print(f"🎭 Role:     Administrator")
    print(f"🆔 User ID:  {result.inserted_id}")
    print("=" * 60)
    print("\n⚠️  IMPORTANT:")
    print("   1. Save these credentials securely")
    print("   2. Change the password after first login")
    print("   3. Update ADMIN_PASSWORD in this script for future use")
    print("=" * 60)
    
    client.close()

if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n❌ Cancelled by user")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()


