"""
Fixed script to create admin user - handles errors and creates admin directly
"""

import sys
import os
from uuid import uuid4
from datetime import datetime
import asyncio

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from backend_python.mongodb_db import get_users_collection
    from backend_python.auth_utils import get_password_hash
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running from the correct directory and all dependencies are installed.")
    sys.exit(1)

async def create_admin():
    """Create admin user in MongoDB"""
    # Admin credentials
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"
    ADMIN_NAME = "System Administrator"
    
    try:
        users_collection = get_users_collection()
        
        # Check if admin already exists
        existing = await users_collection.find_one({"email": ADMIN_EMAIL})
        if existing:
            print(f"⚠️  Admin user with email '{ADMIN_EMAIL}' already exists!")
            print("Updating password and role...")
            new_hash = get_password_hash(ADMIN_PASSWORD)
            await users_collection.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {
                    "password_hash": new_hash,
                    "role": "administrator",
                    "name": ADMIN_NAME
                }}
            )
            print("=" * 60)
            print("✅ Admin user updated successfully!")
            print("=" * 60)
            print(f"📧 Email:    {ADMIN_EMAIL}")
            print(f"🔑 Password: {ADMIN_PASSWORD}")
            print(f"👤 Name:     {ADMIN_NAME}")
            print(f"🎭 Role:     Administrator")
            print("=" * 60)
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
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == "__main__":
    try:
        print("🚀 Creating admin user...")
        print("=" * 60)
        asyncio.run(create_admin())
        print("\n✅ Done! You can now login with:")
        print("   Email: admin@inclusivelearning.com")
        print("   Password: Admin123!")
    except KeyboardInterrupt:
        print("\n❌ Cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
