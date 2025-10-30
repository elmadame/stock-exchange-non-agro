import { APP_TITLE } from "@/const";
import NewsAdmin from "@/components/NewsAdmin";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
              <p className="text-xs text-muted-foreground font-mono">ADMIN PANEL</p>
            </div>
            <Button onClick={() => setLocation("/")} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Market
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <NewsAdmin />
      </main>
    </div>
  );
}
