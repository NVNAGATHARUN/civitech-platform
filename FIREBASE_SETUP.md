# Firebase Setup Guide

## Quick Start

Your Firebase is already configured! The environment variables are in `.env.local`.

## Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## Seed Database

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/admin
3. Click "Seed Schemes DB" button

## Test Accounts

Create these accounts for testing:
- `citizen@demo.com`
- `volunteer@demo.com`
- `admin@demo.com`

## Firebase Console

Access your project: https://console.firebase.google.com/project/hackfest-2k26

## Environment Variables

Already configured in `.env.local`. For production deployment, add these to your hosting platform:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

## Services Available

- `src/services/auth.ts` - Authentication
- `src/services/profile.ts` - Profile management
- `src/services/schemeStatus.ts` - Scheme tracking

## Troubleshooting

### Connection failed (FirebaseError)
If you see a `Connection failed` error in the console:
1. **gRPC Blocked**: Your network might be blocking the default Firebase connection (gRPC/WebSockets). The app is now configured to fallback to **Long Polling**, which should resolve this.
2. **Database Not Created**: Ensure you have clicked "Create Database" in the [Firebase Console](https://console.firebase.google.com/project/hackfest-2k26/firestore).
3. **Region Issues**: Make sure your Firestore location is set.

## Need Help?

Check the detailed walkthrough in the artifacts or Firebase documentation.
