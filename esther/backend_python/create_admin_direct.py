"""
Direct admin creation - ensures admin is created in MongoDB
"""
import sys
import os
import asyncio
from uuid import uuid4
from datetime import datetime

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

print("=" * 60)
print("🔧 Creating Admin User in MongoDB")
print("=" * 60)
print(f"📁 Current directory: {current_dir}")
print(f"📁 Parent directory: {parent_dir}")

try:
    from backend_python.settings_configuration import settings
    print(f"✅ Settings loaded")
    print(f"   MongoDB URL: {settings.MONGODB_URL}")
    print(f"   Database: {settings.MONGODB_DATABASE_NAME}")
except Exception as e:
    print(f"❌ Failed to load settings: {e}")
    sys.exit(1)

try:
    from motor.motor_asyncio import AsyncIOMotorClient
    from backend_python.auth_utils import get_password_hash, verify_password
    print("✅ Imports successful")
except Exception as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

async def create_admin():
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"
    ADMIN_NAME = "System Administrator"
    
    print("\n🚀 Connecting to MongoDB...")
    
    try:
        # Connect directly to MongoDB
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DATABASE_NAME]
        users_collection = db["users"]
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Normalize email
        normalized_email = ADMIN_EMAIL.lower().strip()
        
        # Check if admin exists
        print(f"\n🔍 Checking for existing admin user...")
        existing = await users_collection.find_one({"email": normalized_email})
        
        if not existing:
            # Try case-insensitive search
            all_users = await users_collection.find({}).to_list(length=1000)
            existing = next((u for u in all_users if u.get("email", "").lower().strip() == normalized_email), None)
        
        if existing:
            print(f"⚠️  Admin user found: {existing.get('email')}")
            print("   Updating password and role...")
            
            # Generate and verify password hash
            new_hash = get_password_hash(ADMIN_PASSWORD)
            if not verify_password(ADMIN_PASSWORD, new_hash):
                print("❌ ERROR: Password hash verification failed!")
                return
            
            # Update user
            result = await users_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {
                    "email": normalized_email,
                    "password_hash": new_hash,
                    "role": "administrator",
                    "name": ADMIN_NAME
                }}
            )
            
            print(f"✅ Update result: {result.modified_count} document(s) modified")
            
            # Verify update
            updated = await users_collection.find_one({"_id": existing["_id"]})
            stored_hash = updated.get("password_hash", "")
            verify_result = verify_password(ADMIN_PASSWORD, stored_hash)
            
            print(f"✅ Password verification: {verify_result}")
            
        else:
            print("📝 Creating new admin user...")
            
            # Generate password hash
            password_hash = get_password_hash(ADMIN_PASSWORD)
            
            # Verify hash works
            if not verify_password(ADMIN_PASSWORD, password_hash):
                print("❌ ERROR: Password hash verification failed!")
                return
            
            # Create admin user
            admin_user = {
                "_id": str(uuid4()),
                "email": normalized_email,
                "name": ADMIN_NAME,
                "role": "administrator",
                "password_hash": password_hash,
                "created_at": datetime.utcnow()
            }
            
            # Insert into MongoDB
            result = await users_collection.insert_one(admin_user)
            print(f"✅ Insert result: {result.inserted_id}")
            
            # Verify insertion
            inserted = await users_collection.find_one({"_id": result.inserted_id})
            if inserted:
                stored_hash = inserted.get("password_hash", "")
                verify_result = verify_password(ADMIN_PASSWORD, stored_hash)
                print(f"✅ Password verification: {verify_result}")
            else:
                print("❌ ERROR: User not found after insertion!")
                return
        
        # Final verification
        print("\n🔍 Final verification...")
        final_user = await users_collection.find_one({"email": normalized_email})
        if final_user:
            print("=" * 60)
            print("✅ ADMIN USER READY!")
            print("=" * 60)
            print(f"📧 Email:    {final_user.get('email')}")
            print(f"🔑 Password: {ADMIN_PASSWORD}")
            print(f"👤 Name:     {final_user.get('name')}")
            print(f"🎭 Role:     {final_user.get('role')}")
            print(f"🆔 User ID:  {final_user.get('_id')}")
            print("=" * 60)
            
            # Test password one more time
            final_hash = final_user.get("password_hash", "")
            final_verify = verify_password(ADMIN_PASSWORD, final_hash)
            print(f"\n🔐 Final password test: {'✅ PASS' if final_verify else '❌ FAIL'}")
            print("=" * 60)
        else:
            print("❌ ERROR: User not found in final verification!")
        
        client.close()
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(create_admin())
        print("\n✅ Script completed!")
    except KeyboardInterrupt:
        print("\n❌ Cancelled by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
