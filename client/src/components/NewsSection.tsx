import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Newspaper, Clock } from "lucide-react";

export default function NewsSection() {
  const { data: news, isLoading } = trpc.news.recent.useQuery({ limit: 5 });

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600 hover:bg-red-700';
      case 'medium':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'low':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-bold">Market News</CardTitle>
          </div>
          <CardDescription>Loading latest updates...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!news || news.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-bold">Market News</CardTitle>
          </div>
          <CardDescription>No news available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-bold">Market News</CardTitle>
        </div>
        <CardDescription>Latest market updates and announcements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{post.title}</h3>
                  <Badge className={getPriorityColor(post.priority)} variant="default">
                    {post.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimestamp(post.timestamp)}
              </span>
              <span>By {post.author}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
