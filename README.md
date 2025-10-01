
# VaultWise - Modern Multi-Asset Savings Platform

VaultWise is a modern, multi-asset savings platform built with Next.js, Firebase, and Genkit. It provides users with tools to manage a portfolio of precious metals and digital assets, featuring AI-powered market analysis, personalized savings suggestions, and a real-time price ticker.

The application is localized for both Turkish (`tr`) and English (`en`), with language detection and routing handled by middleware.

## ✨ Core Features

- **Multi-Asset Portfolio:** Manage a portfolio of assets like Gold (XAU) and Silver (XAG).
- **Real-Time Market Data:** Live price cards and a scrolling news ticker keep users informed.
- **AI-Powered Insights:**
  - **Market Analysis:** Get Genkit-powered analysis of the current market situation.
  - **Savings Suggestions:** Receive personalized, automated savings plan recommendations.
- **Firebase Integration:** Secure authentication, Firestore database for user data, and Firebase Storage for user-uploaded avatars.
- **Modern UI/UX:** Built with ShadCN UI, Tailwind CSS, and Framer Motion for a premium, responsive experience.
- **Localization:** Full support for English and Turkish.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Clone the Repository

```bash
git clone https://github.com/Btmcode/vaultwise-app.git
cd vaultwise-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env.local` file by copying the `.env.example` file:

```bash
cp .env.example .env.local
```

Now, fill in the values in your `.env.local` file. You can get these from your Firebase project settings. **This file should never be committed to Git.**

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

---

## ☁️ Deployment to Netlify

This project is configured for seamless deployment to Netlify. After connecting your new, private GitHub repository to Netlify, you must configure the environment variables in the Netlify UI for the deployment to succeed.

### **Step 1: Connect Netlify to Your New GitHub Repository**

If you are setting up a new site or re-linking after creating a new repository:

1.  Log in to your **Netlify account**.
2.  Go to your **Site settings > Build & deploy > Repository**.
3.  Click **"Manage repository"** and then **"Link to a different repository"**.
4.  Select **GitHub** and authorize access.
5.  Choose your new `Btmcode/vaultwise-app` repository from the list.

### **Step 2: Configure Environment Variables in Netlify**

For the deployment to succeed, you **must** configure the same environment variables from your `.env.local` file in the Netlify UI. **Do not commit your `.env.local` or `.env` files to GitHub.**

1.  Go to your **Site Settings > Build & deploy > Environment > Environment variables**.
2.  Click **"Add a variable"** and create an entry for **each** of the variables listed below.

**Firebase Client SDK Config:**
(Found in your Firebase project settings: Project Overview > Project settings > General > Your apps > Web app)

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

**Firebase Admin SDK Config (CRITICAL FOR SECURITY):**
(Generated from a new service account key in Google Cloud: IAM & Admin > Service Accounts)

- `FIREBASE_PROJECT_ID`: Your Firebase project ID.
- `FIREBASE_CLIENT_EMAIL`: Your service account's email address (e.g., `firebase-adminsdk-...@...`).
- `FIREBASE_PRIVATE_KEY`: **Important:** Copy the entire private key from your service account's JSON file. It must start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`. When you paste it into the Netlify UI, it should handle the newlines correctly.

Your final Netlify environment variables should look similar to this:

| Key                                     | Value (Examples)                                                   |
| --------------------------------------- | ------------------------------------------------------------------ |
| `FIREBASE_CLIENT_EMAIL`                 | `firebase-adminsdk-...@...`                                        |
| `FIREBASE_PRIVATE_KEY`                  | `-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n`   |
| `FIREBASE_PROJECT_ID`                   | `your-project-id`                                                  |
| `NEXT_PUBLIC_FIREBASE_API_KEY`          | `AIza...`                                                          |
| `NEXT_PUBLIC_FIREBASE_APP_ID`           | `1:...:web:...`                                                    |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`      | `your-project-id.firebaseapp.com`                                  |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`   | `G-...`                                                            |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| `...`                                                              |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`   | `your-project-id.appspot.com`                                      |

Once these variables are set, your next `git push` to the `main` branch will trigger a successful and secure deployment on Netlify.
