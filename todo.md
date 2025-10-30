# Project TODO

## Core Features
- [x] Initialize stock data with 17 stocks (ILYS, KRME, KLA, LRA, LSA-R, LSA, MLSA, MRA, SRTA, SRAPPLY, ATHE, RGNA, CCI, MTZA, JNAK, MLIS, MRRT)
- [x] File-based storage system (JSON) for stock data and votes
- [x] Voting system - users can rank their top 10 stocks daily
- [x] Point allocation system (1st: 25pts, 2nd: 18pts, 3rd: 15pts, 4th: 12pts, 5th: 10pts, 6th: 8pts, 7th: 6pts, 8th: 4pts, 9th: 2pts, 10th: 1pt)
- [x] Market hours enforcement (8am-2pm Mexico City time)
- [x] Automatic daily penalty system for stocks ranked 11th and below (-1 for 11th, -2 for 12th, etc.)
- [x] Leaderboard display showing current stock rankings and points
- [x] Voting form interface for users to submit their top 10 rankings
- [x] Daily vote reset mechanism at market close (2pm)
- [x] Cumulative point tracking system
- [x] Market status indicator (Open/Closed)
- [x] User guide documentation

## Design & Functionality Updates
- [x] Dark theme with professional stock exchange look and feel
- [x] Add daily gains/losses display for each stock
- [x] Stock exchange-style visual elements (ticker lines, financial charts aesthetic)
- [x] Remove authentication requirement - make voting completely anonymous
- [x] Use browser fingerprinting or session-based voting instead of user accounts
- [x] Update UI to match real stock exchange platforms (dark backgrounds, red/green indicators)

## Bugs
- [x] Fix stocks not loading - investigate data file reading issue (FALSE ALARM - stocks are loading correctly)

## New Features
- [x] Real-time notifications when market opens (8am) and closes (2pm) Mexico City time
- [x] News section for posting market updates and announcements
- [x] Admin interface for creating/editing/deleting news posts
- [x] Public news display on homepage

## Critical Bugs
- [x] Fix timezone display - added "Mexico City" label to clarify timezone
- [x] Fix stocks not loading on published version - resolved with cache refresh
- [x] Fix time showing 3am instead of 9am on published version - resolved
