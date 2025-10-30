# Stock Exchange Non Agro

A professional dark-themed stock voting platform where users anonymously rank their top 10 stocks daily. Built with modern web technologies to deliver a real-time trading experience.

## Features

- **Anonymous Voting System**: No signup required - vote using secure browser sessions
- **Daily Rankings**: Stocks earn points based on user votes (1st: 25pts down to 10th: 1pt)
- **Automatic Penalties**: Stocks outside top 10 lose points daily (11th: -1, 12th: -2, etc.)
- **Market Hours**: Voting open 8am-2pm Mexico City time
- **Real-time Updates**: Live leaderboard with daily gains/losses displayed
- **News Section**: Admin interface to post market updates and announcements
- **Dark Theme**: Professional stock exchange aesthetic with color-coded indicators

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express 4 + tRPC 11
- **Storage**: File-based JSON (no database required)
- **Deployment**: Ready for GitHub Pages, Vercel, or any static host

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stock-exchange-non-agro.git
cd stock-exchange-non-agro
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser to `http://localhost:3000`

## Project Structure

```
stock-exchange-non-agro/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components (Home, Admin)
│   │   └── lib/         # Utilities and tRPC client
├── server/              # Backend Express + tRPC
│   ├── stockData.json   # Stock rankings and votes
│   ├── newsData.json    # Market news posts
│   ├── stockManager.ts  # Stock voting logic
│   ├── newsManager.ts   # News management logic
│   └── cronJob.ts       # Automated daily processing
├── drizzle/             # Database schema (optional)
└── shared/              # Shared types and constants
```

## Usage

### For Users

1. Visit the website during market hours (8am-2pm Mexico City time)
2. Click "Submit Your Vote" to open the voting interface
3. Select and rank your top 10 stocks
4. Submit your vote - you can update it anytime before market close

### For Administrators

1. Navigate to `/admin` to access the news management panel
2. Create market updates with priority levels (high/medium/low)
3. Edit or delete existing news posts
4. All changes appear immediately on the homepage

## Data Storage

All data is stored in JSON files for simplicity and portability:

- `server/stockData.json` - Stock rankings, points, and daily votes
- `server/newsData.json` - Market news and announcements

This file-based approach makes the entire application easy to backup and deploy to GitHub.

## Automated Processing

The system runs hourly checks to:
- Calculate daily point totals from all votes
- Apply penalties to stocks ranked 11th and below
- Track daily changes for each stock
- Reset daily votes at market close

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for various platforms including:
- GitHub Pages
- Vercel
- Netlify
- Traditional hosting

## Initial Stock List

The platform includes 17 stocks:
ILYS, KRME, KLA, LRA, LSA-R, LSA, MLSA, MRA, SRTA, SRAPPLY, ATHE, RGNA, CCI, MTZA, JNAK, MLIS, MRRT

## License

MIT License - feel free to use this project for your own stock voting platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
