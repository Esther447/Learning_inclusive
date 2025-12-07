#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Create admin user - Simple and direct
"""

import sys
import os
import asyncio
from uuid import uuid4
from datetime import datetime

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

print("🔧 Setting up...")
print(f"📁 Working directory: {current_dir}")

try:
    from backend_python.mongodb_db import get_users_collection
    from backend_python.auth_utils import get_password_hash
    print("✅ Imports successful")
except Exception as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

async def main():
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"
    ADMIN_NAME = "System Administrator"
    
    print("\n🚀 Creating admin user...")
    print("=" * 60)
    
    try:
        users_collection = get_users_collection()
        print("✅ Connected to MongoDB")
        
        # Check if exists
        existing = await users_collection.find_one({"email": ADMIN_EMAIL})
        if existing:
            print(f"⚠️  Admin already exists! Updating...")
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
            print("✅ ADMIN USER UPDATED!")
            print("=" * 60)
        else:
            # Create new
            admin_user = {
                "_id": str(uuid4()),
                "email": ADMIN_EMAIL,
                "name": ADMIN_NAME,
                "role": "administrator",
                "password_hash": get_password_hash(ADMIN_PASSWORD),
                "created_at": datetime.utcnow()
            }
            result = await users_collection.insert_one(admin_user)
            print("=" * 60)
            print("✅ ADMIN USER CREATED!")
            print("=" * 60)
            print(f"🆔 User ID: {result.inserted_id}")
        
        print(f"📧 Email:    {ADMIN_EMAIL}")
        print(f"🔑 Password: {ADMIN_PASSWORD}")
        print(f"👤 Name:     {ADMIN_NAME}")
        print(f"🎭 Role:     Administrator")
        print("=" * 60)
        print("\n✅ SUCCESS! You can now login with:")
        print(f"   Email: {ADMIN_EMAIL}")
        print(f"   Password: {ADMIN_PASSWORD}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n❌ Cancelled")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
