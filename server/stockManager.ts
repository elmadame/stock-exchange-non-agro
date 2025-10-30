import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'stockData.json');

export interface Stock {
  symbol: string;
  points: number;
  dailyChange: number; // Points gained/lost today
  previousPoints: number; // Points at start of day
}

export interface Vote {
  sessionId: string; // Anonymous session identifier
  rankings: string[]; // Array of 10 stock symbols in order (1st to 10th)
  timestamp: Date;
}

export interface StockData {
  stocks: Stock[];
  lastProcessedDate: string | null;
  dailyVotes: Vote[];
}

const POINT_SYSTEM: Record<number, number> = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
};

async function readData(): Promise<StockData> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(content);
    // Convert timestamp strings back to Date objects
    if (data.dailyVotes) {
      data.dailyVotes = data.dailyVotes.map((vote: any) => ({
        ...vote,
        timestamp: new Date(vote.timestamp),
      }));
    }
    // Ensure all stocks have dailyChange and previousPoints
    if (data.stocks) {
      data.stocks = data.stocks.map((stock: any) => ({
        ...stock,
        dailyChange: stock.dailyChange ?? 0,
        previousPoints: stock.previousPoints ?? stock.points ?? 0,
      }));
    }
    return data;
  } catch (error) {
    console.error('Error reading stock data:', error);
    throw error;
  }
}

async function writeData(data: StockData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing stock data:', error);
    throw error;
  }
}

export function isMarketOpen(): boolean {
  const now = new Date();
  // Convert to Mexico City time (CST/CDT - UTC-6/UTC-5)
  const mexicoCityTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
  const hour = mexicoCityTime.getHours();
  
  // Market open: 8am-2pm (8-13, since 2pm means before 14:00)
  return hour >= 8 && hour < 14;
}

export function getTodayDateString(): string {
  const now = new Date();
  const mexicoCityTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
  return mexicoCityTime.toISOString().split('T')[0];
}

export async function getStocks(): Promise<Stock[]> {
  const data = await readData();
  return data.stocks.sort((a, b) => b.points - a.points);
}

export async function submitVote(sessionId: string, rankings: string[]): Promise<{ success: boolean; message: string }> {
  if (!isMarketOpen()) {
    return { success: false, message: 'Market is closed. Voting is only allowed between 8am and 2pm Mexico City time.' };
  }

  if (rankings.length !== 10) {
    return { success: false, message: 'You must rank exactly 10 stocks.' };
  }

  const data = await readData();
  const validSymbols = data.stocks.map(s => s.symbol);
  
  // Validate all symbols exist
  for (const symbol of rankings) {
    if (!validSymbols.includes(symbol)) {
      return { success: false, message: `Invalid stock symbol: ${symbol}` };
    }
  }

  // Check for duplicates
  if (new Set(rankings).size !== rankings.length) {
    return { success: false, message: 'Each stock can only be ranked once.' };
  }

  const today = getTodayDateString();
  
  // Check if session already voted today
  const existingVoteIndex = data.dailyVotes.findIndex(
    v => v.sessionId === sessionId && new Date(v.timestamp).toISOString().split('T')[0] === today
  );

  const vote: Vote = {
    sessionId,
    rankings,
    timestamp: new Date(),
  };

  if (existingVoteIndex >= 0) {
    // Update existing vote
    data.dailyVotes[existingVoteIndex] = vote;
  } else {
    // Add new vote
    data.dailyVotes.push(vote);
  }

  await writeData(data);
  return { success: true, message: 'Vote submitted successfully!' };
}

export async function hasSessionVotedToday(sessionId: string): Promise<boolean> {
  const data = await readData();
  const today = getTodayDateString();
  
  return data.dailyVotes.some(
    v => v.sessionId === sessionId && new Date(v.timestamp).toISOString().split('T')[0] === today
  );
}

export async function getSessionVoteToday(sessionId: string): Promise<string[] | null> {
  const data = await readData();
  const today = getTodayDateString();
  
  const vote = data.dailyVotes.find(
    v => v.sessionId === sessionId && new Date(v.timestamp).toISOString().split('T')[0] === today
  );
  
  return vote ? vote.rankings : null;
}

export async function processEndOfDay(): Promise<void> {
  const data = await readData();
  const today = getTodayDateString();

  // Only process once per day
  if (data.lastProcessedDate === today) {
    return;
  }

  // Store current points as previous points
  data.stocks.forEach(stock => {
    stock.previousPoints = stock.points;
  });

  // Calculate points from today's votes
  const stockPoints: Record<string, number> = {};
  data.stocks.forEach(stock => {
    stockPoints[stock.symbol] = 0;
  });

  // Add points from votes
  data.dailyVotes.forEach(vote => {
    const voteDate = new Date(vote.timestamp).toISOString().split('T')[0];
    if (voteDate === today) {
      vote.rankings.forEach((symbol, index) => {
        const position = index + 1;
        stockPoints[symbol] += POINT_SYSTEM[position] || 0;
      });
    }
  });

  // Sort stocks by points to determine rankings
  const sortedStocks = Object.entries(stockPoints)
    .sort(([, a], [, b]) => b - a)
    .map(([symbol]) => symbol);

  // Apply penalties to stocks ranked 11th and below
  sortedStocks.forEach((symbol, index) => {
    const rank = index + 1;
    if (rank > 10) {
      const penalty = -(rank - 10);
      stockPoints[symbol] += penalty;
    }
  });

  // Update stock points (cumulative) and calculate daily change
  data.stocks.forEach(stock => {
    const pointsEarned = stockPoints[stock.symbol];
    stock.points += pointsEarned;
    stock.dailyChange = pointsEarned;
  });

  // Clear daily votes for the new day
  data.dailyVotes = data.dailyVotes.filter(vote => {
    const voteDate = new Date(vote.timestamp).toISOString().split('T')[0];
    return voteDate !== today;
  });

  data.lastProcessedDate = today;
  await writeData(data);
}

export async function getMarketStatus(): Promise<{
  isOpen: boolean;
  currentTime: string;
  nextOpenTime?: string;
  nextCloseTime?: string;
}> {
  const isOpen = isMarketOpen();
  const now = new Date();
  const mexicoCityTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
  
  return {
    isOpen,
    currentTime: mexicoCityTime.toLocaleTimeString('en-US', { 
      timeZone: 'America/Mexico_City',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    }),
    nextOpenTime: isOpen ? undefined : '8:00 AM',
    nextCloseTime: isOpen ? '2:00 PM' : undefined,
  };
}
