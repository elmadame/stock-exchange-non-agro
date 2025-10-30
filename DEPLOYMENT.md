# Deployment Instructions

## Overview
Stock Exchange Non Agro uses file-based storage (JSON) for all data, making it ideal for deployment via GitHub and standard hosting platforms.

## File-Based Storage
All stock data and votes are stored in `server/stockData.json`. This file contains:
- Stock symbols and cumulative points
- Daily votes from users
- Last processed date for penalty calculations

**Important**: The `stockData.json` file will be created automatically on first run if it doesn't exist. You can commit the initial version to your repository.

## GitHub Deployment

### 1. Initialize Git Repository
```bash
cd /home/ubuntu/stock-exchange-non-agro
git init
git add .
git commit -m "Initial commit: Stock Exchange Non Agro"
```

### 2. Create GitHub Repository
1. Go to GitHub and create a new repository
2. Do NOT initialize with README, .gitignore, or license (we already have these)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Environment Variables
The following environment variables are required for production deployment:

### Required (Auto-configured in Manus)
- `DATABASE_URL` - MySQL/TiDB connection (not used but required by template)
- `JWT_SECRET` - Session signing secret
- `OAUTH_SERVER_URL` - Manus OAuth backend URL
- `VITE_OAUTH_PORTAL_URL` - Manus login portal URL
- `VITE_APP_ID` - Manus OAuth application ID
- `OWNER_OPEN_ID` - Owner's OpenID
- `OWNER_NAME` - Owner's name

### Optional Customization
- `VITE_APP_TITLE` - Website title (default: "Stock Exchange Non Agro")
- `VITE_APP_LOGO` - Logo URL
- `PORT` - Server port (default: 3000)

## Deployment Platforms

### Manus Platform (Recommended)
1. Click the **Publish** button in the Management UI header
2. The platform handles all environment variables automatically
3. Your site will be deployed with a `.manus.space` domain
4. Custom domains can be configured in Settings → Domains

### Other Platforms (Vercel, Railway, Render, etc.)

#### Build Commands
```bash
pnpm install
pnpm build
```

#### Start Command
```bash
pnpm start
```

#### Important Notes
- Ensure Node.js 22.x is available
- Set all required environment variables in your platform's settings
- The `stockData.json` file will persist if your platform provides persistent storage
- For platforms without persistent storage, consider migrating to a database

## Data Persistence

### File-Based Storage (Current)
- Simple and portable
- Perfect for GitHub version control
- Works on any platform with file system access
- Data stored in `server/stockData.json`

### Migrating to Database (Optional)
If you need better scalability or your hosting platform doesn't support persistent file storage:

1. Update `server/stockManager.ts` to use database instead of JSON
2. Create database tables for stocks and votes
3. Update environment variables with database credentials

## Automated Daily Processing
The application includes a cron job that runs hourly to process end-of-day calculations:
- Applies point bonuses to top 10 stocks
- Applies penalties to stocks ranked 11th and below
- Resets daily votes after processing

This runs automatically on server startup and continues running. No external cron service needed.

## Monitoring
- Check server logs for daily processing confirmations
- Look for `[CRON]` prefixed messages
- Monitor the leaderboard for correct point calculations

## Troubleshooting

### Data Not Persisting
- Verify `server/stockData.json` has write permissions
- Check if your hosting platform provides persistent storage
- Consider migrating to database storage

### Market Hours Not Working
- Ensure server timezone is set correctly or relies on Mexico City timezone conversion
- Check server logs for timezone-related errors

### Votes Not Processing
- Check `[CRON]` messages in server logs
- Verify the cron job is running (should log every hour)
- Manually trigger processing by restarting the server

## Support
For issues or questions, visit https://help.manus.im
