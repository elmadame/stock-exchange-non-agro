import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { TrendingUp, TrendingDown, Minus, Clock, BarChart3, Activity } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import VotingForm from "@/components/VotingForm";
import NewsSection from "@/components/NewsSection";
import { toast } from "sonner";

export default function Home() {
  const { data: stocks, isLoading: stocksLoading, refetch: refetchStocks } = trpc.stocks.list.useQuery();
  const { data: marketStatus } = trpc.stocks.marketStatus.useQuery(undefined, {
    refetchInterval: 60000, // Refresh every minute
  });
  const { data: hasVoted } = trpc.stocks.hasVotedToday.useQuery();
  const { data: userVote } = trpc.stocks.getUserVote.useQuery();

  const [showVotingForm, setShowVotingForm] = useState(false);
  const previousMarketStatus = useRef<boolean | undefined>(undefined);

  // Monitor market status changes and show notifications
  useEffect(() => {
    if (marketStatus && previousMarketStatus.current !== undefined) {
      // Market just opened
      if (marketStatus.isOpen && !previousMarketStatus.current) {
        toast.success("🔔 Market is now OPEN!", {
          description: "You can now submit your votes until 2:00 PM Mexico City time.",
          duration: 8000,
        });
      }
      // Market just closed
      if (!marketStatus.isOpen && previousMarketStatus.current) {
        toast.error("🔔 Market is now CLOSED!", {
          description: "Voting has ended for today. Market reopens tomorrow at 8:00 AM.",
          duration: 8000,
        });
      }
    }
    if (marketStatus) {
      previousMarketStatus.current = marketStatus.isOpen;
    }
  }, [marketStatus]);

  const handleVoteSuccess = () => {
    setShowVotingForm(false);
    refetchStocks();
    toast.success("✅ Vote submitted successfully!", {
      description: "Your rankings have been recorded.",
    });
  };

  const getRankBadgeColor = (index: number) => {
    if (index === 0) return "bg-yellow-600 text-white border-yellow-500";
    if (index === 1) return "bg-gray-500 text-white border-gray-400";
    if (index === 2) return "bg-orange-700 text-white border-orange-600";
    return "bg-muted text-muted-foreground border-border";
  };

  const getDailyChangeDisplay = (dailyChange: number) => {
    if (dailyChange > 0) {
      return (
        <div className="flex items-center gap-1 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="font-mono">+{dailyChange}</span>
        </div>
      );
    }
    if (dailyChange < 0) {
      return (
        <div className="flex items-center gap-1 text-red-400">
          <TrendingDown className="w-4 h-4" />
          <span className="font-mono">{dailyChange}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Minus className="w-4 h-4" />
        <span className="font-mono">0</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Stock Exchange Style */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">{APP_TITLE}</h1>
                <p className="text-xs text-muted-foreground font-mono">NON-AGRO EXCHANGE</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {marketStatus && (
                <div className="flex items-center gap-3 px-4 py-2 rounded bg-secondary/50 border border-border">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-mono text-foreground">
                      {marketStatus.currentTime}
                    </span>
                    <span className="text-xs text-muted-foreground">Mexico City</span>
                  </div>
                  <Badge 
                    variant={marketStatus.isOpen ? "default" : "secondary"}
                    className={marketStatus.isOpen ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                  >
                    {marketStatus.isOpen ? "MARKET OPEN" : "MARKET CLOSED"}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Ticker line animation */}
        <div className="ticker-line h-px bg-border"></div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - News & Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* News Section */}
            <NewsSection />
            
            {/* Leaderboard */}
            <div>
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Activity className="w-5 h-5 text-blue-400" />
                      Stock Rankings
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Live rankings • Daily voting • Top 10 earn points
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Total Stocks</div>
                    <div className="text-2xl font-bold text-foreground font-mono">17</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {stocksLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading market data...</div>
                ) : stocks && stocks.length > 0 ? (
                  <div className="space-y-1">
                    {stocks.map((stock, index) => (
                      <div
                        key={stock.symbol}
                        className="flex items-center justify-between p-3 rounded border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <Badge className={`${getRankBadgeColor(index)} font-mono text-xs px-2 border`}>
                            #{index + 1}
                          </Badge>
                          <div className="flex-1">
                            <div className="font-bold text-base text-foreground font-mono tracking-wide">
                              {stock.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          {/* Daily Change */}
                          <div className="text-right min-w-[80px]">
                            <div className="text-xs text-muted-foreground mb-0.5">Daily</div>
                            {getDailyChangeDisplay(stock.dailyChange)}
                          </div>
                          {/* Total Points */}
                          <div className="text-right min-w-[100px]">
                            <div className="text-xs text-muted-foreground mb-0.5">Total</div>
                            <div className={`text-xl font-bold font-mono ${
                              stock.points > 0 ? 'text-green-400' : 
                              stock.points < 0 ? 'text-red-400' : 
                              'text-muted-foreground'
                            }`}>
                              {stock.points > 0 ? '+' : ''}{stock.points}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No stocks available</div>
                )}
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Voting Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Daily Voting</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Rank your top 10 stocks • 8am-2pm Mexico City time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!marketStatus?.isOpen ? (
                  <div className="text-center py-6">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium mb-2 text-foreground">Market is Closed</p>
                    <p className="text-xs text-muted-foreground">
                      Voting opens at {marketStatus?.nextOpenTime} Mexico City time
                    </p>
                  </div>
                ) : hasVoted ? (
                  <div className="space-y-4">
                    <div className="text-center py-4 bg-green-950/30 rounded-lg border border-green-800">
                      <Activity className="w-10 h-10 mx-auto mb-2 text-green-400" />
                      <p className="text-sm font-medium text-green-400">Vote Submitted!</p>
                      <p className="text-xs text-green-600 mt-1">
                        You can update your vote until market closes
                      </p>
                    </div>
                    {userVote && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Your Rankings:</p>
                        <div className="space-y-1">
                          {userVote.map((symbol: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-sm bg-secondary/30 p-2 rounded border border-border">
                              <Badge variant="outline" className="w-8 text-center font-mono border-border">
                                {idx + 1}
                              </Badge>
                              <span className="font-medium font-mono text-foreground">{symbol}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={() => setShowVotingForm(true)}
                      variant="outline"
                      className="w-full border-border hover:bg-secondary"
                    >
                      Update Vote
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Market closes at {marketStatus?.nextCloseTime}
                    </p>
                    <Button
                      onClick={() => setShowVotingForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Submit Your Vote
                    </Button>
                  </div>
                )}

                {/* Point System Info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium mb-2 text-muted-foreground">Point System:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground font-mono">
                    <div className="text-green-400">1st: +25pts</div>
                    <div className="text-green-400">6th: +8pts</div>
                    <div className="text-green-400">2nd: +18pts</div>
                    <div className="text-green-400">7th: +6pts</div>
                    <div className="text-green-400">3rd: +15pts</div>
                    <div className="text-green-400">8th: +4pts</div>
                    <div className="text-green-400">4th: +12pts</div>
                    <div className="text-green-400">9th: +2pts</div>
                    <div className="text-green-400">5th: +10pts</div>
                    <div className="text-green-400">10th: +1pt</div>
                  </div>
                  <p className="text-xs text-red-400 mt-2 font-mono">
                    Outside top 10: 11th(-1), 12th(-2), 13th(-3)...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Voting Form Dialog */}
      {showVotingForm && stocks && (
        <VotingForm
          stocks={stocks}
          initialRankings={userVote || []}
          onClose={() => setShowVotingForm(false)}
          onSuccess={handleVoteSuccess}
        />
      )}
    </div>
  );
}
