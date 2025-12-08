#!/usr/bin/env python
"""Test script to check registered routes"""
from main import app

print("\n=== Registered Routes ===\n")
for route in app.routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        print(f"Path: {route.path}")
        print(f"Methods: {route.methods}")
        print()
        
print("\n=== Auth Routes Check ===\n")
auth_routes = [r for r in app.routes if hasattr(r, 'path') and '/auth' in r.path]
if auth_routes:
    print(f"Found {len(auth_routes)} auth routes:")
    for route in auth_routes:
        print(f"  - {route.path} {getattr(route, 'methods', [])}")
else:
    print("No auth routes found!")
