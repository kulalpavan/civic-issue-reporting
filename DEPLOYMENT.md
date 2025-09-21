# 🌐 Cloud Deployment Guide

This guide will help you deploy your Civic Issue Reporting application to the cloud so it can be accessed from any network worldwide.

## 🚀 Quick Deployment Steps

### Step 1: Deploy Backend to Render (Free)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Connect Your Repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

3. **Configure Deployment**
   - **Name**: `civic-issue-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Set Environment Variables**
   - Add: `JWT_SECRET` = `your-super-secret-jwt-key-12345`
   - Add: `NODE_ENV` = `production`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the generated URL (e.g., `https://civic-issue-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel (Free)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set Environment Variable**
   - When prompted, set `VITE_API_URL` to your Render backend URL + `/api`
   - Example: `https://civic-issue-backend.onrender.com/api`

### Step 3: Update API Configuration

Update `frontend/.env.production` with your actual backend URL:
```
VITE_API_URL=https://your-actual-backend-url.onrender.com/api
```

## 🌍 Alternative: One-Click Deploy

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Click "Deploy Now"
3. Connect GitHub and select your repository
4. Deploy both frontend and backend automatically

### Option B: Heroku
1. Install Heroku CLI
2. Create two apps: one for frontend, one for backend
3. Push each folder to respective Heroku apps

## 📱 Access Your App Globally

After deployment, your app will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Anyone with internet access can use these URLs from any device, anywhere in the world!

## 🔐 Login Credentials (Same as Local)
- **Citizen**: `citizen1` / `citizen123`
- **Officer**: `officer1` / `officer123`
- **Admin**: `admin1` / `admin123`

## 💡 Benefits of Cloud Deployment
- ✅ Works from any network worldwide
- ✅ No Wi-Fi dependency
- ✅ Professional URLs to share
- ✅ Always online (24/7)
- ✅ Free tier available
- ✅ Automatic HTTPS security

## 🆘 Need Help?
If you run into any issues during deployment, let me know and I'll help you troubleshoot!