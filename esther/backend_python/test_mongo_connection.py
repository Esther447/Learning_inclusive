"""Test MongoDB connection and create admin"""
import asyncio
import sys
import os
from uuid import uuid4
from datetime import datetime

# Setup path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from motor.motor_asyncio import AsyncIOMotorClient
    from backend_python.settings_configuration import settings
    from backend_python.auth_utils import get_password_hash, verify_password
except Exception as e:
    print(f"Import error: {e}")
    sys.exit(1)

async def main():
    print("Testing MongoDB connection...")
    print(f"MongoDB URL: {settings.MONGODB_URL}")
    print(f"Database: {settings.MONGODB_DATABASE_NAME}")
    
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("✅ MongoDB is running!")
        
        db = client[settings.MONGODB_DATABASE_NAME]
        users_collection = db["users"]
        
        ADMIN_EMAIL = "admin@inclusivelearning.com"
        ADMIN_PASSWORD = "Admin123!"
        normalized_email = ADMIN_EMAIL.lower().strip()
        
        # Check existing
        existing = await users_collection.find_one({"email": normalized_email})
        
        if existing:
            print(f"Admin exists, updating...")
            new_hash = get_password_hash(ADMIN_PASSWORD)
            await users_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"password_hash": new_hash, "role": "administrator", "name": "System Administrator", "email": normalized_email}}
            )
            print("✅ Admin updated!")
        else:
            print("Creating admin...")
            admin_user = {
                "_id": str(uuid4()),
                "email": normalized_email,
                "name": "System Administrator",
                "role": "administrator",
                "password_hash": get_password_hash(ADMIN_PASSWORD),
                "created_at": datetime.utcnow()
            }
            result = await users_collection.insert_one(admin_user)
            print(f"✅ Admin created! ID: {result.inserted_id}")
        
        # Verify
        final = await users_collection.find_one({"email": normalized_email})
        if final:
            print(f"\n✅ VERIFICATION:")
            print(f"   Email: {final.get('email')}")
            print(f"   Role: {final.get('role')}")
            print(f"   Password hash exists: {'password_hash' in final}")
            if 'password_hash' in final:
                is_valid = verify_password(ADMIN_PASSWORD, final['password_hash'])
                print(f"   Password valid: {is_valid}")
        
        client.close()
        print("\n✅ SUCCESS! Admin user is ready.")
        print(f"   Login with: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
