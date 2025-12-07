# 🔧 Login Error Fix

## Issue
Login returns 500 Internal Server Error

## Likely Causes

### 1. MongoDB Connection Issue
Check backend terminal for MongoDB errors

### 2. User Doesn't Exist
Create a test user first

### 3. Password Hash Issue
Password verification failing

---

## Quick Fixes

### Fix 1: Create Test User

Run this in backend terminal:
```bash
cd esther/backend_python
python create_admin.py
```

Or create user via API:
```bash
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Fix 2: Check Backend Logs

Look at your backend terminal for the actual error message. It will show:
- MongoDB connection errors
- User ID conversion errors
- Password verification errors

### Fix 3: Test with Existing User

If you already signed up, use that email to login.

---

## Test Login

**Via Browser:**
1. Go to `http://localhost:5173/login`
2. Use email: `test@example.com`
3. Password: `test123`

**Via API:**
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## Check Backend Terminal

The backend terminal will show the actual error. Common errors:

**MongoDB not connected:**
```
Warning: MongoDB not available
```

**User ID format issue:**
```
Error converting user ID
```

**Password hash issue:**
```
Error verifying password
```

---

## Workaround

If MongoDB is causing issues, you can temporarily use the mock login in frontend or check the backend terminal output to see the exact error.

**Check your backend terminal now - it will show the real error!**
