# Deployment Guide: InternTrack Pro

Since you want to handle the deployment yourself, I've prepared your local project so it's ready to go. You have a **Monorepo** structure (both `client` and `server` are in the same folder).

Here is the exact step-by-step guide to get your application live on the internet for free using **Vercel** and **Render**.

---

## 🟢 Step 1: Push Your Code to GitHub

I have already initialized your local Git repository and made the first commit! Now you just need to put it on GitHub.

1. Go to [GitHub - New Repository](https://github.com/new).
2. Name the repository `interntrack-pro`.
3. Keep it **Public** (or Private) and DO NOT check "Add a README file".
4. Click **Create repository**.
5. Copy the commands under the heading **"...or push an existing repository from the command line"** and run them in your VS Code terminal at the root (`Desktop\FSDL-PROJECT`).
   ```bash
   git branch -M main
   git remote add origin https://github.com/your-username/interntrack-pro.git
   git push -u origin main
   ```

---

## 🟡 Step 2: Deploy the Backend (Render)

We will deploy the Node.js/Express server to Render.com.

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. Connect your GitHub account and select your `interntrack-pro` repository.
5. Fill out the configuration exactly as follows:
   - **Name**: `interntrack-api`
   - **Region**: Choose the one closest to you (e.g., Singapore)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Select the "Free" tier.
6. Scroll down to **Environment Variables** and click Add Environment Variable:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `interntrack_pro_jwt_secret_key_2026_super_secure`
   - `MONGO_URI` = `mongodb+srv://admin123:password12345@cluster0.vrn8bkq.mongodb.net/interntrack?retryWrites=true&w=majority&appName=Cluster0`
   - `CLIENT_URL` = `(Leave this blank for now, we will come back and update it later after frontend deployment!)`
7. Click **Create Web Service**. Wait for the build to finish. Copy the assigned Render URL (e.g., `https://interntrack-api-xxxx.onrender.com`).

---

## 🔵 Step 3: Deploy the Frontend (Vercel)

We will deploy the React (Vite) client to Vercel.com.

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Look for your `interntrack-pro` repository and click **Import**.
3. In the "Configure Project" screen, you MUST change the **Root Directory**. Click Edit next to "Root Directory" and select the `client` folder.
4. Expand the **Environment Variables** section and add:
   - `VITE_API_URL` = Paste your Render URL from Step 2 (e.g., `https://interntrack-api-xxxx.onrender.com`)
   *Important: Do not put a trailing slash `/` at the end of the URL.*
5. Click **Deploy**. Wait for the confetti! Wait roughly 1-2 minutes for Vercel to build the site.
6. Once deployed, click "Continue to Dashboard" and copy your live frontend URL (e.g., `https://interntrack-pro.vercel.app`).

---

## 🎨 Step 4: Final Connection Link

1. Go back to your [Render Dashboard](https://dashboard.render.com).
2. Open your `interntrack-api` web service.
3. Click on **Environment** in the left menu.
4. Find the `CLIENT_URL` variable and update it with your new Vercel frontend URL (`https://interntrack-pro.vercel.app`).
5. Click **Save Changes**.

---

### 🎉 All Done!

Your platform is now live! Simply visit your Vercel URL to access InternTrack Pro from anywhere on the internet.
