# Backend Deployment Guide

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Git repository with backend code

## Deployment Options

### Option 1: Railway (Recommended)

1. **Prepare Repository:**

   - Push wordle-backend folder to GitHub
   - Ensure all files are committed

2. **Deploy on Railway:**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Spring Boot

3. **Configuration:**
   - Railway will automatically build and deploy
   - Environment variables are set automatically
   - Get your deployment URL from Railway dashboard

### Option 2: Heroku

1. **Install Heroku CLI:**

   ```bash
   # macOS
   brew install heroku/brew/heroku

   # Login
   heroku login
   ```

2. **Deploy:**

   ```bash
   # Create Heroku app
   heroku create your-app-name

   # Set Java version
   echo "java.runtime.version=17" > system.properties

   # Deploy
   git push heroku main
   ```

3. **Environment Variables:**
   ```bash
   heroku config:set SPRING_PROFILES_ACTIVE=production
   ```

### Option 3: DigitalOcean App Platform

1. **Create app.yaml** (already created)
2. **Deploy:**
   - Go to DigitalOcean App Platform
   - Create new app
   - Connect GitHub repository
   - Select wordle-backend folder
   - Deploy

### Option 4: AWS Elastic Beanstalk

1. **Package Application:**

   ```bash
   mvn clean package
   ```

2. **Create WAR file** (modify pom.xml):

   ```xml
   <packaging>war</packaging>
   ```

3. **Deploy:**
   - Go to AWS Elastic Beanstalk
   - Create new application
   - Upload WAR file
   - Configure environment

## Environment Variables

### Required Variables:

- `PORT`: Port number (auto-set by platform)
- `SPRING_PROFILES_ACTIVE`: Set to "production"

### Optional Variables:

- `LOG_LEVEL`: Set logging level (default: INFO)
- `CORS_ALLOWED_ORIGINS`: Override CORS origins

## Post-Deployment Steps

1. **Update Frontend:**

   - Set `NEXT_PUBLIC_BACKEND_URL` to your backend URL
   - Update CORS settings if needed

2. **Test Endpoints:**

   ```bash
   # Health check
   curl https://your-backend-url/api/wordle/health

   # Test solver
   curl -X POST https://your-backend-url/api/wordle/solve \
     -H "Content-Type: application/json" \
     -d '{"word": "hello", "hints": "- e - - x"}'
   ```

3. **Monitor Logs:**
   - Check platform logs for errors
   - Monitor performance metrics

## Troubleshooting

### Common Issues:

- **Build failures:** Check Java version compatibility
- **CORS errors:** Verify allowed origins
- **Port issues:** Ensure PORT environment variable is set
- **Memory issues:** Increase instance size

### Support:

- Railway: [docs.railway.app](https://docs.railway.app)
- Heroku: [devcenter.heroku.com](https://devcenter.heroku.com)
- Spring Boot: [spring.io/guides](https://spring.io/guides)

