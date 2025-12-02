"""Quick script to check MongoDB database contents"""
import sys
import os
# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

import asyncio
from backend_python.mongodb_db import get_users_collection, get_mongo_db

async def check_database():
    print("🔍 Checking MongoDB database...\n")
    
    try:
        # Check users collection
        users_collection = get_users_collection()
        user_count = await users_collection.count_documents({})
        print(f"📊 Users in database: {user_count}")
        
        if user_count > 0:
            print("\n📝 Sample users:")
            users = await users_collection.find({}).to_list(length=10)
            for user in users:
                print(f"  - Email: {user.get('email', 'N/A')}")
                print(f"    ID: {user.get('_id', 'N/A')}")
                print(f"    Name: {user.get('name', 'N/A')}")
                print(f"    Role: {user.get('role', 'N/A')}")
                print()
        else:
            print("⚠️  No users found in database")
            print("💡 Try signing up a new user from the frontend")
        
        # List all collections
        db = get_mongo_db()
        collections = await db.list_collection_names()
        print(f"\n📚 Collections in database: {', '.join(collections) if collections else 'None'}")
        
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        print("💡 Make sure MongoDB is running!")

if __name__ == "__main__":
    asyncio.run(check_database())
