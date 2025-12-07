"""
Simple script to create or update an admin user.
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
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"
    ADMIN_NAME = "System Administrator"

    try:
        users_collection = get_users_collection()

        normalized_email = ADMIN_EMAIL.lower().strip()

        # Check if admin exists
        existing = await users_collection.find_one({"email": normalized_email})

        if not existing:
            all_users = await users_collection.find({}).to_list(length=1000)
            existing = next(
                (u for u in all_users if u.get("email", "").lower().strip() == normalized_email),
                None
            )

        # --------------------------------------------------
        # ADMIN ALREADY EXISTS → UPDATE PASSWORD + ROLE
        # --------------------------------------------------
        if existing:
            print(f"⚠️  Admin user '{existing.get('email')}' already exists.")
            print("Updating password and ensuring role is administrator...")

            new_hash = get_password_hash(ADMIN_PASSWORD)

            if not verify_password(ADMIN_PASSWORD, new_hash):
                print("❌ ERROR: Password hash verification failed!")
                return

            await users_collection.update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        "email": normalized_email,
                        "password_hash": new_hash,
                        "role": "administrator",
                        "name": ADMIN_NAME
                    }
                }
            )

            print("✅ Admin updated successfully!")
            return

        # --------------------------------------------------
        # CREATE NEW ADMIN
        # --------------------------------------------------
        password_hash = get_password_hash(ADMIN_PASSWORD)

        if not verify_password(ADMIN_PASSWORD, password_hash):
            print("❌ ERROR: Hash verification failed!")
            return

        admin_user = {
            "_id": str(uuid4()),
            "email": normalized_email,
            "name": ADMIN_NAME,
            "role": "administrator",
            "password_hash": password_hash,
            "created_at": datetime.utcnow()
        }

        result = await users_collection.insert_one(admin_user)

        print("✅ Admin user created successfully!")
        print(f"User ID: {result.inserted_id}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("❌ Cancelled by user")
