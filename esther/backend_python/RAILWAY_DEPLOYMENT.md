# Railway Deployment Guide

## Quick Setup

### Step 1: Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Configure Service
1. **Root Directory:** Set to `esther/backend_python`
2. **Build Command:** `pip install -r requirements.txt && npm install --production`
3. **Start Command:** `node index.js`

### Step 3: Environment Variables
Add these in Railway dashboard → Variables tab:

```
MONGODB_URL=your_mongodb_connection_string
MONGODB_DATABASE_NAME=inclusive_learning
SECRET_KEY=your-secret-key-here
REFRESH_SECRET_KEY=your-refresh-secret-key-here
CORS_ORIGINS=https://your-frontend.vercel.app
PYTHON_BIN=python3
```

### Step 4: Deploy
Railway will automatically detect and deploy. Check the logs if there are issues.

## Troubleshooting

### Issue: "No start command was found"
**Solution:**
- Make sure `package.json` exists in `esther/backend_python`
- Verify `startCommand` in `railway.json` is correct
- Check Root Directory is set to `esther/backend_python`

### Issue: "Python not found"
**Solution:**
- Add `PYTHON_BIN=python3` to environment variables
- Or set `PYTHON_BIN=python` if python3 doesn't work
- Check `runtime.txt` specifies correct Python version

### Issue: "Uvicorn not found"
**Solution:**
- Verify `requirements.txt` includes `uvicorn`
- Check build logs to ensure pip install completed
- Try adding `uvicorn[standard]` to requirements.txt

### Issue: "Port already in use"
**Solution:**
- Railway automatically sets `$PORT` environment variable
- Don't hardcode port numbers
- The `index.js` script uses `process.env.PORT`

### Issue: "MongoDB connection failed"
**Solution:**
- Verify `MONGODB_URL` is set correctly
- Check MongoDB Atlas IP whitelist includes Railway IPs
- Test MongoDB connection string locally first

## Configuration Files

- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Buildpack configuration
- `package.json` - Node.js wrapper for Python
- `index.js` - Node.js script that runs Python uvicorn
- `runtime.txt` - Python version specification

## Alternative: Direct Python Deployment

If the Node.js wrapper doesn't work, you can use Python directly:

1. Update `railway.json`:
```json
{
  "deploy": {
    "startCommand": "python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT"
  }
}
```

2. Remove dependency on `package.json` and `index.js`

## Monitoring

- Check deployment logs in Railway dashboard
- Monitor service health
- Set up alerts for deployment failures

