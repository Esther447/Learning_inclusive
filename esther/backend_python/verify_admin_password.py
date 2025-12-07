"""
Verify admin password is correct
"""
import sys
import os
import asyncio
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_python.mongodb_db import get_users_collection
from backend_python.auth_utils import get_password_hash, verify_password

async def verify():
    ADMIN_EMAIL = "admin@inclusivelearning.com"
    ADMIN_PASSWORD = "Admin123!"
    
    users_collection = get_users_collection()
    user = await users_collection.find_one({"email": ADMIN_EMAIL})
    
    if not user:
        print("❌ Admin user not found!")
        return
    
    print(f"✅ Admin user found: {user.get('email')}")
    print(f"   Role: {user.get('role')}")
    print(f"   Has password_hash: {'password_hash' in user}")
    
    if 'password_hash' in user:
        stored_hash = user['password_hash']
        print(f"\n🔍 Testing password verification...")
        print(f"   Password to test: {ADMIN_PASSWORD}")
        print(f"   Stored hash: {stored_hash[:50]}...")
        
        is_valid = verify_password(ADMIN_PASSWORD, stored_hash)
        print(f"\n{'✅' if is_valid else '❌'} Password verification: {is_valid}")
        
        if not is_valid:
            print("\n⚠️  Password hash doesn't match! Regenerating...")
            new_hash = get_password_hash(ADMIN_PASSWORD)
            await users_collection.update_one(
                {"email": ADMIN_EMAIL},
                {"$set": {"password_hash": new_hash}}
            )
            print("✅ Password hash updated!")
            
            # Verify again
            is_valid = verify_password(ADMIN_PASSWORD, new_hash)
            print(f"{'✅' if is_valid else '❌'} New hash verification: {is_valid}")
    else:
        print("❌ No password_hash found! Creating one...")
        new_hash = get_password_hash(ADMIN_PASSWORD)
        await users_collection.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": new_hash}}
        )
        print("✅ Password hash created!")

if __name__ == "__main__":
    asyncio.run(verify())
