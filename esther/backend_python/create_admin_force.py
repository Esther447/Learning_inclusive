"""Force create admin - writes output to file"""
import asyncio
import sys
import os
from uuid import uuid4
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

output_file = open("admin_creation_log.txt", "w", encoding="utf-8")

def log(msg):
    print(msg)
    output_file.write(msg + "\n")
    output_file.flush()

try:
    from motor.motor_asyncio import AsyncIOMotorClient
    from backend_python.settings_configuration import settings
    from backend_python.auth_utils import get_password_hash, verify_password
    log("✅ Imports successful")
except Exception as e:
    log(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc(file=output_file)
    sys.exit(1)

async def main():
    log("=" * 60)
    log("🔧 Creating Admin User")
    log("=" * 60)
    log(f"MongoDB URL: {settings.MONGODB_URL}")
    log(f"Database: {settings.MONGODB_DATABASE_NAME}")
    
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"
    normalized_email = ADMIN_EMAIL.lower().strip()
    
    try:
        log("\n🔌 Connecting to MongoDB...")
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=10000)
        await client.admin.command('ping')
        log("✅ Connected!")
        
        db = client[settings.MONGODB_DATABASE_NAME]
        users_collection = db["users"]
        
        log(f"\n🔍 Checking for admin: {normalized_email}")
        existing = await users_collection.find_one({"email": normalized_email})
        
        if existing:
            log(f"⚠️  Found existing user: {existing.get('_id')}")
            log("   Updating...")
            new_hash = get_password_hash(ADMIN_PASSWORD)
            result = await users_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {
                    "email": normalized_email,
                    "password_hash": new_hash,
                    "role": "administrator",
                    "name": "System Administrator"
                }}
            )
            log(f"✅ Updated: {result.modified_count} document(s)")
        else:
            log("📝 Creating new admin...")
            admin_user = {
                "_id": str(uuid4()),
                "email": normalized_email,
                "name": "System Administrator",
                "role": "administrator",
                "password_hash": get_password_hash(ADMIN_PASSWORD),
                "created_at": datetime.utcnow()
            }
            result = await users_collection.insert_one(admin_user)
            log(f"✅ Created: {result.inserted_id}")
        
        # Verify
        log("\n🔍 Verifying...")
        final = await users_collection.find_one({"email": normalized_email})
        if final:
            log("=" * 60)
            log("✅ ADMIN USER READY!")
            log("=" * 60)
            log(f"Email: {final.get('email')}")
            log(f"Role: {final.get('role')}")
            log(f"Password: {ADMIN_PASSWORD}")
            if 'password_hash' in final:
                is_valid = verify_password(ADMIN_PASSWORD, final['password_hash'])
                log(f"Password valid: {is_valid}")
            log("=" * 60)
        else:
            log("❌ User not found after creation!")
        
        client.close()
        log("\n✅ Done!")
        
    except Exception as e:
        log(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc(file=output_file)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        log(f"Fatal: {e}")
        import traceback
        traceback.print_exc(file=output_file)
    finally:
        output_file.close()
        print("\n✅ Check admin_creation_log.txt for details")
