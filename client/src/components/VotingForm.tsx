import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { GripVertical, X, ChevronUp, ChevronDown } from "lucide-react";

interface Stock {
  symbol: string;
  points: number;
  dailyChange: number;
  previousPoints: number;
}

interface VotingFormProps {
  stocks: Stock[];
  initialRankings: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function VotingForm({
  stocks,
  initialRankings,
  onClose,
  onSuccess,
}: VotingFormProps) {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(initialRankings);
  const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);

  const submitVoteMutation = trpc.stocks.submitVote.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit vote");
    },
  });

  useEffect(() => {
    // Filter out already selected stocks
    const available = stocks.filter((stock) => !selectedStocks.includes(stock.symbol));
    setAvailableStocks(available);
  }, [stocks, selectedStocks]);

  const handleAddStock = (symbol: string) => {
    if (selectedStocks.length < 10) {
      setSelectedStocks([...selectedStocks, symbol]);
    }
  };

  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter((s) => s !== symbol));
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newRankings = [...selectedStocks];
      [newRankings[index - 1], newRankings[index]] = [
        newRankings[index],
        newRankings[index - 1],
      ];
      setSelectedStocks(newRankings);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < selectedStocks.length - 1) {
      const newRankings = [...selectedStocks];
      [newRankings[index], newRankings[index + 1]] = [
        newRankings[index + 1],
        newRankings[index],
      ];
      setSelectedStocks(newRankings);
    }
  };

  const handleSubmit = () => {
    if (selectedStocks.length !== 10) {
      toast.error("Please select exactly 10 stocks");
      return;
    }
    submitVoteMutation.mutate({ rankings: selectedStocks });
  };

  const getPointsForRank = (rank: number): number => {
    const points: Record<number, number> = {
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
    return points[rank] || 0;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Vote for Your Top 10 Stocks</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select and rank 10 stocks. Use buttons to reorder your selections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Rankings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-foreground">
                Your Rankings ({selectedStocks.length}/10)
              </h3>
              {selectedStocks.length === 10 && (
                <Badge className="bg-green-600">Ready to Submit</Badge>
              )}
            </div>

            {selectedStocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-secondary/20">
                Select stocks from below to start ranking
              </div>
            ) : (
              <div className="space-y-1">
                {selectedStocks.map((symbol, index) => (
                  <div
                    key={symbol}
                    className="flex items-center gap-3 p-3 rounded border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Badge className="w-8 text-center font-mono bg-blue-600 hover:bg-blue-700">
                        {index + 1}
                      </Badge>
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium font-mono text-foreground">{symbol}</span>
                      <Badge variant="outline" className="ml-auto border-green-600 text-green-400 font-mono">
                        +{getPointsForRank(index + 1)} pts
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8 p-0 hover:bg-secondary"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === selectedStocks.length - 1}
                        className="h-8 w-8 p-0 hover:bg-secondary"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveStock(symbol)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Stocks */}
          {availableStocks.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3 text-foreground">Available Stocks</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableStocks.map((stock) => (
                  <Button
                    key={stock.symbol}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddStock(stock.symbol)}
                    disabled={selectedStocks.length >= 10}
                    className="justify-start font-mono border-border hover:bg-secondary hover:border-blue-600"
                  >
                    {stock.symbol}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleSubmit}
              disabled={selectedStocks.length !== 10 || submitVoteMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitVoteMutation.isPending ? "Submitting..." : "Submit Vote"}
            </Button>
            <Button variant="outline" onClick={onClose} className="border-border hover:bg-secondary">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
