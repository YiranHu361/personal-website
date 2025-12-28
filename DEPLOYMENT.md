# Deployment Guide

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Prepare your repository:**

   - Push your code to GitHub
   - Ensure all files are committed

2. **Deploy on Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

3. **Configuration:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Option 2: Deploy via CLI (if Node.js >= 18)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

## Backend Deployment

### Option 1: Railway (Recommended for Spring Boot)

1. **Prepare backend:**

   - Push wordle-backend folder to GitHub
   - Ensure pom.xml is configured correctly

2. **Deploy on Railway:**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Spring Boot
   - Set environment variables if needed

3. **Update frontend API URLs:**
   - Replace `http://localhost:8080` with your Railway backend URL
   - Update CORS settings in WordleController.java

### Option 2: Heroku

1. **Prepare backend:**

   - Add `Procfile` to wordle-backend root:

   ```
   web: java -jar target/wordle-backend-0.0.1-SNAPSHOT.jar
   ```

2. **Deploy:**
   - Install Heroku CLI
   - Login: `heroku login`
   - Create app: `heroku create your-app-name`
   - Deploy: `git push heroku main`

### Option 3: DigitalOcean App Platform

1. **Create app.yaml:**
   ```yaml
   name: wordle-backend
   services:
     - name: api
       source_dir: wordle-backend
       github:
         repo: your-username/your-repo
         branch: main
       run_command: mvn spring-boot:run
       environment_slug: java
       instance_count: 1
       instance_size_slug: basic-xxs
   ```

## Environment Variables

### Frontend (Vercel)

- `NEXT_PUBLIC_BACKEND_URL`: Your backend API URL
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`: EmailJS service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`: EmailJS template ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`: EmailJS public key

### Backend (Railway/Heroku)

- `PORT`: Port number (usually auto-set)
- `SPRING_PROFILES_ACTIVE`: production

## Post-Deployment Steps

1. **Update API URLs:**

   - Replace localhost URLs with production URLs
   - Update CORS settings
   - Test all functionality

2. **Configure Custom Domain:**

   - Add custom domain in Vercel dashboard
   - Update DNS settings
   - Enable HTTPS

3. **Monitor Performance:**
   - Check Vercel analytics
   - Monitor backend logs
   - Test Wordle solver functionality

## Troubleshooting

### Common Issues:

- **Build failures:** Check Node.js version compatibility
- **API errors:** Verify CORS settings and URLs
- **Static files:** Ensure public folder is properly configured
- **EmailJS:** Verify environment variables

### Support:

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

