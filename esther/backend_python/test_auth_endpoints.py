#!/usr/bin/env python
"""Test signup and login endpoints"""
import json
import requests

def test_auth():
    print("=" * 60)
    print("TESTING AUTH ENDPOINTS")
    print("=" * 60)
    
    # Test signup
    print("\n[1] Testing POST /api/auth/signup...")
    signup_payload = {
        "email": "testuser@example.com",
        "password": "TestPassword123",
        "name": "Test User"
    }
    print(f"   Payload: {json.dumps(signup_payload)}")
    
    try:
        response = requests.post(
            "http://localhost:8001/api/auth/signup",
            json=signup_payload,
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            signup_data = response.json()
            print(f"   ✅ Signup successful!")
            print(f"      User ID: {signup_data.get('id')}")
            print(f"      Email: {signup_data.get('email')}")
            print(f"      Name: {signup_data.get('name')}")
            print(f"      Role: {signup_data.get('role')}")
        else:
            print(f"   ❌ Signup failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test login
    print("\n[2] Testing POST /api/auth/login...")
    login_payload = {
        "email": "testuser@example.com",
        "password": "TestPassword123"
    }
    print(f"   Payload: {json.dumps(login_payload)}")
    
    try:
        response = requests.post(
            "http://localhost:8001/api/auth/login",
            json=login_payload,
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            login_data = response.json()
            print(f"   ✅ Login successful!")
            print(f"      Access Token: {login_data.get('access_token')[:50]}...")
            print(f"      Token Type: {login_data.get('token_type')}")
            print(f"      User: {login_data.get('user', {}).get('email')}")
        else:
            print(f"   ❌ Login failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)

# Run the test
if __name__ == "__main__":
    test_auth()
