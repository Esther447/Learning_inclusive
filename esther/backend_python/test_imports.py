#!/usr/bin/env python
"""Test script to diagnose import issues"""
import sys
import os
import traceback

# Fix the import path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

print(f"Python path: {sys.path[:2]}")
print("\n=== Testing Auth Router Import ===\n")
try:
    from backend_python.routers import auth
    print(f"✅ Auth router imported successfully")
    print(f"   auth module: {auth}")
    print(f"   auth.router: {auth.router}")
except Exception as e:
    print(f"❌ Failed to import auth router")
    print(f"   Error: {e}")
    traceback.print_exc()

print("\n=== Testing Other Routers ===\n")
routers_to_test = ['users', 'courses', 'progress', 'accessibility', 'mentorship']
for router_name in routers_to_test:
    try:
        module = __import__(f'backend_python.routers.{router_name}', fromlist=[router_name])
        print(f"✅ {router_name.upper()} router imported successfully")
    except Exception as e:
        print(f"❌ {router_name.upper()} failed: {e}")
