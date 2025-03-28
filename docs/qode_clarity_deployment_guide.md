# Qode Clarity Deployment Guide

This comprehensive guide will walk you through deploying the Qode Clarity application with:

- Frontend: GitHub Pages with custom subdomain
- Backend: FastAPI on Google Cloud Platform (free tier)
- Database: Firebase Firestore
- MongoDB: Migrating data to Firestore

## Table of Contents

1. [Frontend Deployment (GitHub Pages)](#1-frontend-deployment-github-pages)
2. [Backend Deployment (GCP)](#2-backend-deployment-gcp)
3. [Database Migration (MongoDB to Firestore)](#3-database-migration-mongodb-to-firestore)
4. [Custom Subdomain Setup](#4-custom-subdomain-setup)
5. [Connecting the Stack](#5-connecting-the-stack)
6. [Testing and Troubleshooting](#6-testing-and-troubleshooting)

## 1. Frontend Deployment (GitHub Pages)

### 1.1 Prepare React App for Deployment

1. Install the `gh-pages` package:

   ```bash
   cd frontend
   npm install --save gh-pages
   ```

2. Add the following to your `package.json`:

   ```json
   "homepage": "https://yourusername.github.io/qode-clarity",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Update your React Router to work with GitHub Pages:

   ```jsx
   // In your root component
   import { HashRouter as Router } from "react-router-dom";

   // Replace BrowserRouter with HashRouter
   function App() {
     return <Router>{/* Your routes */}</Router>;
   }
   ```

4. Update API calls to use environment variables:

   ```jsx
   // Create .env.production file
   REACT_APP_API_URL=https://api.your-subdomain.com

   // In your API calls
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

### 1.2 Deploy to GitHub Pages

1. Create a GitHub repository for your frontend code

2. Initialize and push your code:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/qode-clarity.git
   git push -u origin master
   ```

3. Deploy to GitHub Pages:

   ```bash
   npm run deploy
   ```

4. Configure GitHub repository settings:
   - Go to repository -> Settings -> Pages
   - Source: gh-pages branch
   - Save and wait for deployment

## 2. Backend Deployment (GCP)

### 2.1 Prepare FastAPI for Deployment

1. Create `main.py` (if not already existing):

   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   import uvicorn
   from routes import questions, categories, users  # Import your route modules

   app = FastAPI(title="Qode Clarity API")

   # Configure CORS
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-subdomain.com", "https://yourusername.github.io"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   # Include routers
   app.include_router(questions.router)
   app.include_router(categories.router)
   app.include_router(users.router)

   @app.get("/")
   def read_root():
       return {"message": "Welcome to Qode Clarity API"}

   if __name__ == "__main__":
       uvicorn.run("main:app", host="0.0.0.0", port=8080)
   ```

2. Create `requirements.txt` for dependencies:

   ```
   fastapi==0.95.1
   uvicorn==0.22.0
   firebase-admin==6.1.0
   google-cloud-firestore==2.11.1
   pydantic==1.10.7
   python-dotenv==1.0.0
   ```

3. Create `app.yaml` for Google App Engine:

   ```yaml
   runtime: python311

   instance_class: F1

   env_variables:
     PROJECT_ID: "your-gcp-project-id"
     GOOGLE_APPLICATION_CREDENTIALS: "firebase-key.json"

   handlers:
     - url: /.*
       script: auto
   ```

4. Create `.gcloudignore` to exclude unnecessary files:

   ```
   .git
   .gitignore
   __pycache__/
   .venv/
   .env
   .env.local
   ```

5. Modify Firebase initialization in your code:

   ```python
   import os
   import firebase_admin
   from firebase_admin import credentials, firestore

   # For local development
   if os.path.exists('firebase-key.json'):
       cred = credentials.Certificate('firebase-key.json')
       firebase_admin.initialize_app(cred)
   else:
       # For production - GCP handles auth automatically
       firebase_admin.initialize_app()

   db = firestore.client()
   ```

### 2.2 Deploy to Google Cloud Platform

1. Create a GCP account and project:

   - Go to https://console.cloud.google.com/
   - Create a new project named "qode-clarity"
   - Note down the Project ID

2. Install Google Cloud CLI:

   - Download from: https://cloud.google.com/sdk/docs/install

3. Initialize and authenticate:

   ```bash
   gcloud init
   gcloud auth login
   ```

4. Select your project:

   ```bash
   gcloud config set project your-project-id
   ```

5. Enable required APIs:

   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable cloudscheduler.googleapis.com
   ```

6. Deploy to App Engine:

   ```bash
   cd backend
   gcloud app deploy
   ```

7. View your app logs:
   ```bash
   gcloud app logs tail -s default
   ```

## 3. Database Migration (MongoDB to Firestore)

### 3.1 Set Up Firestore

1. Create a Firebase project:

   - Go to https://console.firebase.google.com/
   - Create a new project and link it to your GCP project
   - Set up Firestore database in Native mode

2. Generate and download service account key:
   - Go to Project Settings -> Service accounts
   - Click "Generate new private key"
   - Save as `firebase-key.json` (keep this secure and don't commit to repo)

### 3.2 Migrate Data from MongoDB to Firestore

1. Create a migration script:

   ```python
   # mongodb_to_firestore.py
   import pymongo
   import firebase_admin
   from firebase_admin import credentials, firestore

   # Initialize Firebase
   cred = credentials.Certificate('firebase-key.json')
   firebase_admin.initialize_app(cred)
   db = firestore.client()

   # Connect to MongoDB
   mongo_client = pymongo.MongoClient("mongodb://username:password@your-mongodb-host:27017/")
   mongo_db = mongo_client["qode_clarity"]

   # Migrate categories collection
   categories = mongo_db["categories"].find({})
   for category in categories:
       category_id = str(category["_id"])
       category_data = {
           "name": category["name"],
           "description": category["description"],
           "icon": category.get("icon", "default_icon"),
           "createdAt": firestore.SERVER_TIMESTAMP
       }
       db.collection("categories").document(category_id).set(category_data)
       print(f"Migrated category: {category['name']}")

   # Migrate questions collection
   questions = mongo_db["questions"].find({})
   for question in questions:
       question_id = str(question["_id"])
       question_data = {
           "title": question["title"],
           "description": question["description"],
           "categoryId": str(question["categoryId"]),
           "difficulty": question.get("difficulty", "medium"),
           "tags": question.get("tags", []),
           "createdAt": firestore.SERVER_TIMESTAMP
       }
       db.collection("questions").document(question_id).set(question_data)
       print(f"Migrated question: {question['title']}")

   print("Migration completed!")
   ```

2. Run the migration script:

   ```bash
   python mongodb_to_firestore.py
   ```

3. Update your FastAPI models and services to use Firestore:

   ```python
   # models/question.py
   from pydantic import BaseModel, Field
   from typing import List, Optional
   from datetime import datetime

   class Question(BaseModel):
       id: Optional[str] = None
       title: str
       description: str
       categoryId: str
       difficulty: str = "medium"
       tags: List[str] = []
       createdAt: Optional[datetime] = None

       class Config:
           schema_extra = {
               "example": {
                   "title": "Binary Search Implementation",
                   "description": "Implement binary search in Python",
                   "categoryId": "algorithms",
                   "difficulty": "medium",
                   "tags": ["search", "algorithms", "binary"]
               }
           }


   # services/question_service.py
   from firebase_admin import firestore
   from models.question import Question

   db = firestore.client()
   questions_ref = db.collection("questions")

   def get_all_questions(limit: int = 20):
       result = []
       query = questions_ref.limit(limit)
       docs = query.stream()

       for doc in docs:
           data = doc.to_dict()
           data["id"] = doc.id
           result.append(Question(**data))

       return result

   def get_question_by_id(question_id: str):
       doc = questions_ref.document(question_id).get()
       if not doc.exists:
           return None

       data = doc.to_dict()
       data["id"] = doc.id
       return Question(**data)

   def create_question(question: Question):
       data = question.dict(exclude={"id"})
       data["createdAt"] = firestore.SERVER_TIMESTAMP
       doc_ref = questions_ref.document()
       doc_ref.set(data)

       return {**data, "id": doc_ref.id}
   ```

## 4. Custom Subdomain Setup

### 4.1 Purchase a Domain (if needed)

1. Choose a domain registrar (Namecheap, GoDaddy, Google Domains, etc.)
2. Purchase your domain (e.g., qodeclarity.com)

### 4.2 Configure GitHub Pages with Custom Domain

1. Create DNS records at your domain registrar:

   - Add an A record pointing to GitHub Pages IPs:
     ```
     A @ 185.199.108.153
     A @ 185.199.109.153
     A @ 185.199.110.153
     A @ 185.199.111.153
     ```
   - Add a CNAME record for www subdomain:
     ```
     CNAME www yourusername.github.io
     ```
   - Add a CNAME record for app subdomain (if needed):
     ```
     CNAME app yourusername.github.io
     ```

2. Configure your GitHub repository:

   - Go to repository Settings -> Pages
   - Enter your custom domain (e.g., app.qodeclarity.com)
   - Check "Enforce HTTPS"
   - Save changes
   - A file called CNAME will be added to your repository

3. Update your React app:
   - Update your `package.json` homepage:
     ```json
     "homepage": "https://app.qodeclarity.com",
     ```
   - Re-deploy using `npm run deploy`

### 4.3 Configure API Subdomain for FastAPI on GCP

1. Add a custom domain to Google App Engine:

   - Go to GCP Console -> App Engine -> Settings -> Custom Domains
   - Click "Add a custom domain"
   - Follow the verification process
   - Add `api.qodeclarity.com` as your domain

2. Create DNS records for the API:

   - Add the CNAME records that Google provides:
     ```
     CNAME api ghs.googlehosted.com
     ```
   - Or follow the specific instructions from Google (may include adding TXT records)

3. Update your FastAPI CORS settings:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "https://app.qodeclarity.com",
           "https://www.qodeclarity.com",
           "https://qodeclarity.com"
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 5. Connecting the Stack

### 5.1 Update Frontend API Calls

1. Update `.env.production`:

   ```
   REACT_APP_API_URL=https://api.qodeclarity.com
   ```

2. Make sure all API calls use this environment variable:

   ```jsx
   // src/services/api.js
   import axios from "axios";

   const API_BASE_URL =
     process.env.REACT_APP_API_URL || "http://localhost:8000";

   const api = axios.create({
     baseURL: API_BASE_URL,
     headers: {
       "Content-Type": "application/json",
     },
   });

   export const fetchQuestions = async (params = {}) => {
     try {
       const response = await api.get("/questions", { params });
       return response.data;
     } catch (error) {
       console.error("Error fetching questions:", error);
       throw error;
     }
   };

   // more API functions...

   export default api;
   ```

### 5.2 Set Up Secure Environment in GCP

1. Set up environment variables in app.yaml:

   ```yaml
   env_variables:
     JWT_SECRET: "your_secure_secret_here"
     ALLOWED_ORIGINS: "https://app.qodeclarity.com,https://qodeclarity.com"
   ```

2. For sensitive variables, use Google Secret Manager:

   ```bash
   # Create a secret
   gcloud secrets create jwt-secret --replication-policy="automatic"
   gcloud secrets versions add jwt-secret --data-file="./jwt-secret.txt"

   # Give App Engine service account access
   gcloud secrets add-iam-policy-binding jwt-secret \
     --member="serviceAccount:your-project-id@appspot.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

3. Update your FastAPI app to use these secrets:
   import os
   from google.cloud import secretmanager

   # Function to access secrets

   def access_secret(secret_id, version="latest"):
   client = secretmanager.SecretManagerServiceClient()
   project_id = os.environ.get("PROJECT_ID")
   name = f"projects/{project_id}/secrets/{secret_id}/versions/{version}"
   response = client.access_secret_version(request={"name": name})
   return response.payload.data.decode("UTF-8")

   # Access secret in your auth code

   JWT_SECRET = os.environ.get("JWT_SECRET")
   if not JWT_SECRET and os.environ.get("PROJECT_ID"):

   ```python

       JWT_SECRET = access_secret("jwt-secret")
   ```

### 5.3 Set Up Firebase Authentication (Optional)

1. Set up Firebase Authentication:

   - Go to Firebase Console -> Authentication
   - Enable Email/Password authentication
   - Configure other sign-in methods if needed

2. Install Firebase auth in your React app:

   ```bash
   npm install firebase
   ```

3. Configure Firebase in your React app:

   ```jsx
   // src/firebase/config.js
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";

   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APP_ID,
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export default app;
   ```

4. Add authentication to your React components:

   ```jsx
   // src/contexts/AuthContext.js
   import React, {
     createContext,
     useContext,
     useState,
     useEffect,
   } from "react";
   import {
     createUserWithEmailAndPassword,
     signInWithEmailAndPassword,
     signOut,
     onAuthStateChanged,
   } from "firebase/auth";
   import { auth } from "../firebase/config";

   const AuthContext = createContext();

   export function useAuth() {
     return useContext(AuthContext);
   }

   export function AuthProvider({ children }) {
     const [currentUser, setCurrentUser] = useState(null);
     const [loading, setLoading] = useState(true);

     function signup(email, password) {
       return createUserWithEmailAndPassword(auth, email, password);
     }

     function login(email, password) {
       return signInWithEmailAndPassword(auth, email, password);
     }

     function logout() {
       return signOut(auth);
     }

     useEffect(() => {
       const unsubscribe = onAuthStateChanged(auth, (user) => {
         setCurrentUser(user);
         setLoading(false);
       });

       return unsubscribe;
     }, []);

     const value = {
       currentUser,
       signup,
       login,
       logout,
     };

     return (
       <AuthContext.Provider value={value}>
         {!loading && children}
       </AuthContext.Provider>
     );
   }
   ```

5. Update API calls to include auth token:

   ```jsx
   // src/services/api.js
   import axios from "axios";
   import { auth } from "../firebase/config";

   const API_BASE_URL =
     process.env.REACT_APP_API_URL || "http://localhost:8000";

   const api = axios.create({
     baseURL: API_BASE_URL,
     headers: {
       "Content-Type": "application/json",
     },
   });

   // Add auth token to requests
   api.interceptors.request.use(async (config) => {
     if (auth.currentUser) {
       const token = await auth.currentUser.getIdToken();
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   // API calls here...
   ```

## 6. Testing and Troubleshooting

### 6.1 Testing the Deployment

1. Test frontend deployment:

   - Visit your custom domain (e.g., https://app.qodeclarity.com)
   - Test all major functionality
   - Check for any console errors

2. Test API endpoints:

   - Visit https://api.qodeclarity.com/docs for Swagger UI
   - Test API endpoints with Postman or cURL
   - Example:
     ```bash
     curl -X GET "https://api.qodeclarity.com/questions?limit=5" -H "accept: application/json"
     ```

3. Test database connections:
   - Verify data is being correctly stored in Firestore
   - Check API responses match expected data

### 6.2 Common Issues and Solutions

#### CORS Issues

If you encounter CORS errors:

1. Check the Network tab in browser developer tools for specific error messages
2. Verify your CORS configuration in FastAPI:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://app.qodeclarity.com", "https://api.qodeclarity.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. Make sure your API calls use the correct protocol (https://)

#### API Connection Issues

If your frontend can't connect to the API:

1. Check that your environment variables are correct
2. Verify your API is running with:
   ```bash
   curl -X GET "https://api.qodeclarity.com/health" -H "accept: application/json"
   ```
3. Check GCP App Engine logs:
   ```bash
   gcloud app logs tail -s default
   ```

#### Firebase Authentication Issues

If authentication is not working:

1. Check Firebase console for any auth errors
2. Verify your environment variables are correct
3. Test with a simple auth flow:
   ```javascript
   auth
     .signInWithEmailAndPassword("test@example.com", "password")
     .then((userCredential) => console.log("Success:", userCredential.user))
     .catch((error) => console.error("Error:", error.code, error.message));
   ```

### 6.3 Performance Monitoring

1. Set up Google Analytics:

   - Create a Google Analytics account
   - Add tracking code to your React app

2. Set up Firebase Performance Monitoring:

   ```bash
   npm install firebase/performance
   ```

   ```jsx
   // src/firebase/config.js
   import { getPerformance } from "firebase/performance";

   // Initialize Performance Monitoring
   export const perf = getPerformance(app);
   ```

3. Set up Cloud Monitoring for your API:
   - Go to GCP Console -> Monitoring
   - Set up alerts for high latency or error rates

## 7. Ongoing Maintenance

### 7.1 CI/CD Setup

1. Set up GitHub Actions for CI/CD:

   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages and GCP

   on:
     push:
       branches: [main]

   jobs:
     deploy-frontend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: "16"
         - name: Install dependencies
           run: |
             cd frontend
             npm ci
         - name: Build and deploy
           run: |
             cd frontend
             npm run deploy
           env:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

     deploy-backend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Google Cloud SDK
           uses: google-github-actions/setup-gcloud@v0
           with:
             project_id: ${{ secrets.GCP_PROJECT_ID }}
             service_account_key: ${{ secrets.GCP_SA_KEY }}
         - name: Deploy to App Engine
           run: |
             cd backend
             gcloud app deploy --quiet
   ```

2. Set up required secrets in your GitHub repository:
   - GITHUB_TOKEN (automatic)
   - GCP_PROJECT_ID
   - GCP_SA_KEY (service account key JSON)

### 7.2 Backup Strategy

1. Set up regular Firestore backups:

   ```bash
   # Create a Cloud Scheduler job for backups
   gcloud scheduler jobs create http firestore-backup \
     --schedule="0 0 * * *" \
     --uri="https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default):exportDocuments" \
     --http-method=POST \
     --oauth-service-account-email=YOUR_SERVICE_ACCOUNT@appspot.gserviceaccount.com \
     --headers="Content-Type=application/json" \
     --message-body="{\"outputUriPrefix\": \"gs://YOUR_BACKUP_BUCKET/backups/$(date +%Y-%m-%d)\"}"
   ```

2. Backup GitHub repository regularly:
   - Use GitHub's built-in archive feature
   - Or clone the repository to a local backup

### 7.3 Domain Renewal Reminders

1. Set up reminder for domain renewal
2. Consider enabling auto-renewal for your domain
3. Keep payment method up to date with your domain registrar

## 8. Cost Management

### 8.1 GCP Free Tier

1. Monitor your GCP usage to stay within free tier limits:

   - App Engine: 28 instance hours per day
   - Firestore: 1GB storage, 50,000 reads, 20,000 writes, 20,000 deletes per day
   - Cloud Storage: 5GB storage, 5,000 Class A operations, 50,000 Class B operations

2. Set up budget alerts:
   - Go to GCP Console -> Billing -> Budgets & Alerts
   - Create a budget with alerts at 50%, 90%, and 100% of your limit

### 8.2 Firebase Free Tier

1. Monitor your Firebase usage:

   - Authentication: 10K/month
   - Firestore: Same as GCP limits
   - Analytics: Unlimited

2. Set up spending alerts in Firebase Console

## 9. Scaling Considerations

### 9.1 Future Growth Options

1. Upgrade App Engine instance class if needed:

   ```yaml
   # app.yaml
   instance_class: F2 # More memory and CPU
   ```

2. Consider Cloud Run for more flexibility:

   - Containerize your FastAPI app
   - Deploy with Cloud Run for better scaling

3. Implement caching for Firestore:
   - Use Redis or Memcached for frequent queries
   - Consider Firebase caching rules

### 9.2 Advanced Options

1. Content Delivery Network (CDN):

   - Set up Firebase Hosting with CDN
   - Move static assets to Cloud Storage with CDN

2. Microservices architecture:

   - Split backend into smaller services
   - Use Cloud Functions for specific features

3. Advanced database options:
   - Use BigQuery for analytics
   - Consider managed MongoDB (MongoDB Atlas) for complex queries

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Google App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud Free Tier](https://cloud.google.com/free)
- [Firestore Data Modeling Guide](https://firebase.google.com/docs/firestore/data-modeling)

This comprehensive guide should help you deploy Qode Clarity with a custom subdomain, migrating from MongoDB to Firestore while hosting the frontend on GitHub Pages and the backend on GCP's free tier.
