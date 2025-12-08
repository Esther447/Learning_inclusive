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

from backend_python.mongodb_db import get_users_collection
from backend_python.auth_utils import get_password_hash, verify_password

async def main():
    # Admin credentials - CHANGE THESE!
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"  # Change this to a secure password
    ADMIN_NAME = "System Administrator"
    
    try:
        users_collection = get_users_collection()
        
        # Normalize email (lowercase, trim)
        normalized_email = ADMIN_EMAIL.lower().strip()
    
        # Check if admin already exists (case-insensitive)
        existing = await users_collection.find_one({"email": normalized_email})
        if not existing:
            # Try case-insensitive search
            all_users = await users_collection.find({}).to_list(length=1000)
            existing = next((u for u in all_users if u.get("email", "").lower().strip() == normalized_email), None)
    if existing:
            print(f"⚠️  Admin user with email '{existing.get('email')}' already exists!")
            print("Updating password and ensuring role is administrator...")
            new_hash = get_password_hash(ADMIN_PASSWORD)
            # Verify hash works
            if not verify_password(ADMIN_PASSWORD, new_hash):
                print("❌ ERROR: Generated hash doesn't verify!")
                return
            await users_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {
                    "email": normalized_email,  # Normalize email
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
        password_hash = get_password_hash(ADMIN_PASSWORD)
        # Verify hash works before inserting
        from backend_python.auth_utils import verify_password
        if not verify_password(ADMIN_PASSWORD, password_hash):
            print("❌ ERROR: Generated hash doesn't verify!")
            return
        
    admin_user = {
        "_id": str(uuid4()),
            "email": normalized_email,  # Use normalized email
        "name": ADMIN_NAME,
        "role": "administrator",
            "password_hash": password_hash,
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
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise

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



