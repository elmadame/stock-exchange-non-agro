# Stock Exchange Non Agro - User Guide

## Purpose
Stock Exchange Non Agro is an anonymous voting platform where users rank their top 10 stocks daily during market hours. Stocks earn points based on rankings, creating a dynamic leaderboard with real-time gains and losses displayed like a professional stock exchange.

## Access
Public access for all visitors. No signup or login required. Voting is completely anonymous using browser sessions.

---

## Powered by Manus

This platform is built with cutting-edge web technologies delivering a professional stock exchange experience. The frontend leverages **React 19** with **TypeScript** for type-safe component development, styled with **Tailwind CSS 4** using a custom dark theme that mimics real financial trading platforms. The backend runs on **Express 4** with **tRPC 11**, providing end-to-end type safety between client and server without manual API contracts.

Anonymous voting is powered by **secure session cookies** that identify returning voters without requiring accounts or personal information. Data persistence uses **file-based JSON storage** for simplicity and portability, perfect for GitHub deployment. The application includes **automated daily processing** via scheduled jobs that calculate points, apply penalties, and track daily changes for each stock. **Deployment** happens on auto-scaling infrastructure with global CDN distribution, ensuring fast load times worldwide and automatic handling of traffic spikes.

---

## Using Your Website

The homepage displays a **Market News** section at the top showing the latest announcements and updates. Each news post includes a title, content, priority badge (HIGH in red, MEDIUM in yellow, or LOW in blue), timestamp, and author name. Below the news section, a professional dark-themed leaderboard shows all 17 stocks ranked by their cumulative points. Each stock card shows its current rank with color-coded badges (gold for 1st, silver for 2nd, bronze for 3rd), the stock symbol in monospace font, daily point change with red or green indicators, and total accumulated points. Stocks gaining points show green upward arrows, while those losing points display red downward arrows, matching the visual language of real stock exchanges.

The header displays the current Mexico City time and a live market status indicator showing "MARKET OPEN" in green or "MARKET CLOSED" in red. Voting is only available between 8am and 2pm Mexico City time. No signup is required—simply visit the site during market hours to participate.

To vote, click "Submit Your Vote" in the Daily Voting panel on the right side. A dialog appears showing all available stocks. Select 10 stocks by clicking them from the grid. Each selected stock appears in your rankings with its position number and the points it will earn. Use the up and down arrow buttons to reorder your selections, or click the X button to remove a stock and choose another. Point values range from 25 points for 1st place down to 1 point for 10th place, displayed in green to indicate gains.

Once you have ranked exactly 10 stocks, click "Submit Vote" to record your choices. Your vote is stored anonymously using a browser session cookie. You can return and update your vote any time before the market closes at 2pm. The system remembers your previous vote and allows you to modify it. After voting, the panel displays a confirmation message and shows your current rankings.

---

## Managing Your Website

The website operates autonomously with minimal management needed. Market hours and point calculations run automatically based on Mexico City timezone. Daily processing happens hourly but only executes once per day, applying point bonuses to the top 10 stocks and penalties to those ranked 11th and below.

To monitor activity or make administrative changes, use the Management UI accessible from the header menu. The **Preview** panel shows the live website exactly as visitors see it. The **Dashboard** panel provides analytics including unique visitors and page views once the site is published. The **Settings** panel allows you to customize the website name and logo by editing `VITE_APP_TITLE` and `VITE_APP_LOGO` environment variables.

All stock data and votes are stored in `server/stockData.json` within your project files. This file-based approach makes the entire application portable and easy to back up by simply committing to GitHub. The automated daily processing tracks daily changes for each stock, allowing the leaderboard to display both cumulative totals and daily gains or losses.

To manage market news and announcements, navigate to `/admin` in your browser. The admin panel lets you create new posts by clicking "New Post", entering a title and content, selecting an author name, and choosing a priority level (high, medium, or low). You can edit existing posts by clicking the pencil icon or delete them with the trash icon. News posts appear immediately on the homepage for all visitors.

---

## Next Steps

Talk to Manus AI anytime to request changes or add features. You can customize the stock list, adjust the point system, modify market hours, or add new features like historical charts or detailed analytics. The current implementation uses anonymous session-based voting, making it accessible to everyone without barriers. Start by voting on your favorite stocks and watch the leaderboard evolve daily based on community preferences.
