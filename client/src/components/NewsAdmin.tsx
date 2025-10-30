import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewsAdmin() {
  const utils = trpc.useUtils();
  const { data: allNews, isLoading } = trpc.news.list.useQuery();
  const createMutation = trpc.news.create.useMutation();
  const updateMutation = trpc.news.update.useMutation();
  const deleteMutation = trpc.news.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "Market Admin",
    priority: "medium" as "high" | "medium" | "low",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      author: "Market Admin",
      priority: "medium",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success("News post created successfully!");
      utils.news.list.invalidate();
      utils.news.recent.invalidate();
      resetForm();
    } catch (error) {
      toast.error("Failed to create news post");
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingId,
        ...formData,
      });
      toast.success("News post updated successfully!");
      utils.news.list.invalidate();
      utils.news.recent.invalidate();
      resetForm();
    } catch (error) {
      toast.error("Failed to update news post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news post?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("News post deleted successfully!");
      utils.news.list.invalidate();
      utils.news.recent.invalidate();
    } catch (error) {
      toast.error("Failed to delete news post");
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      priority: post.priority,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">News Administration</CardTitle>
            <CardDescription>Create and manage market news posts</CardDescription>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-4">
            <h3 className="font-semibold text-lg">
              {editingId ? "Edit News Post" : "Create New Post"}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter news title..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter news content..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: "high" | "medium" | "low") =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleUpdate : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Update" : "Create"}
              </Button>
              <Button onClick={resetForm} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">All News Posts ({allNews?.length || 0})</h3>
          
          {isLoading && <p className="text-muted-foreground">Loading news posts...</p>}
          
          {allNews && allNews.length === 0 && (
            <p className="text-muted-foreground">No news posts yet. Create one to get started!</p>
          )}

          {allNews?.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-lg bg-secondary/30 border border-border"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{post.title}</h4>
                    <Badge className={getPriorityColor(post.priority)} variant="default">
                      {post.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    By {post.author} • {new Date(post.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(post)}
                    className="gap-1"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(post.id)}
                    disabled={deleteMutation.isPending}
                    className="gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
