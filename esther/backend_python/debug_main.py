#!/usr/bin/env python
"""Debug script to test main.py imports"""
import sys
import os
import traceback

# Fix import path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

print("=" * 60)
print("TESTING MAIN.PY IMPORTS")
print("=" * 60)

try:
    print("\n[1/5] Importing FastAPI...")
    from fastapi import FastAPI
    print("✅ FastAPI OK")
    
    print("\n[2/5] Importing database...")
    from backend_python.database import engine, Base, mongo_client
    print("✅ database.py OK")
    
    print("\n[3/5] Importing settings...")
    from backend_python.settings_configuration import settings
    print("✅ settings_configuration.py OK")
    
    print("\n[4/5] Importing exceptions...")
    from backend_python.exceptions import ResourceNotFoundException
    print("✅ exceptions.py OK")
    
    print("\n[5/5] Importing routers from __init__...")
    from backend_python.routers import auth
    print("✅ routers/__init__.py OK")
    print(f"   auth.router = {auth.router}")
    
    print("\n[6/6] Importing main.py...")
    import main
    print("✅ main.py OK")
    print(f"   app = {main.app}")
    
    print("\n" + "=" * 60)
    print("✅ ALL IMPORTS SUCCESSFUL")
    print("=" * 60)
    
except Exception as e:
    print("\n" + "=" * 60)
    print(f"❌ IMPORT FAILED: {type(e).__name__}")
    print("=" * 60)
    print(f"\nError: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()
