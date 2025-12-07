"""
Fix admin login - ensures admin user exists with correct password
"""
import sys
import os
import asyncio
from uuid import uuid4
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_python.mongodb_db import get_users_collection
from backend_python.auth_utils import get_password_hash, verify_password

async def fix_admin():
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"
    ADMIN_NAME = "System Administrator"
    
    print("=" * 60)
    print("🔧 Fixing Admin Login")
    print("=" * 60)
    
    try:
        users_collection = get_users_collection()
        print("✅ Connected to MongoDB")
        
        # Check if admin exists
        user = await users_collection.find_one({"email": ADMIN_EMAIL})
        
        if user:
            print(f"✅ Admin user found: {ADMIN_EMAIL}")
            print(f"   Current role: {user.get('role')}")
            
            # Always update password to ensure it's correct
            print("\n🔄 Updating password hash...")
            new_hash = get_password_hash(ADMIN_PASSWORD)
            
            # Verify the hash works
            test_verify = verify_password(ADMIN_PASSWORD, new_hash)
            if not test_verify:
                print("❌ ERROR: Generated hash doesn't verify! This is a bug.")
                return
            
            # Update user
            await users_collection.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {
                    "password_hash": new_hash,
                    "role": "administrator",
                    "name": ADMIN_NAME
                }}
            )
            
            # Verify stored hash
            updated_user = await users_collection.find_one({"email": ADMIN_EMAIL})
            stored_hash = updated_user.get("password_hash")
            final_verify = verify_password(ADMIN_PASSWORD, stored_hash)
            
            print(f"✅ Password hash updated and verified: {final_verify}")
            
        else:
            print(f"⚠️  Admin user not found. Creating...")
            admin_user = {
                "_id": str(uuid4()),
                "email": ADMIN_EMAIL,
                "name": ADMIN_NAME,
                "role": "administrator",
                "password_hash": get_password_hash(ADMIN_PASSWORD),
                "created_at": datetime.utcnow()
            }
            
            # Verify hash before inserting
            test_verify = verify_password(ADMIN_PASSWORD, admin_user["password_hash"])
            if not test_verify:
                print("❌ ERROR: Generated hash doesn't verify! This is a bug.")
                return
            
            result = await users_collection.insert_one(admin_user)
            print(f"✅ Admin user created: {result.inserted_id}")
            
            # Verify after insert
            new_user = await users_collection.find_one({"_id": result.inserted_id})
            stored_hash = new_user.get("password_hash")
            final_verify = verify_password(ADMIN_PASSWORD, stored_hash)
            print(f"✅ Password verified after creation: {final_verify}")
        
        print("\n" + "=" * 60)
        print("✅ ADMIN LOGIN FIXED!")
        print("=" * 60)
        print(f"📧 Email:    {ADMIN_EMAIL}")
        print(f"🔑 Password: {ADMIN_PASSWORD}")
        print(f"👤 Name:     {ADMIN_NAME}")
        print(f"🎭 Role:     administrator")
        print("=" * 60)
        print("\n✅ You can now login with these credentials!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(fix_admin())
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
