import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Pencil, 
  Trash2, 
  FileCheck,
  MessageSquarePlus,
  Newspaper,
  FileText,
  Send,
  Save
} from "lucide-react";
import { useLocation } from 'wouter';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Draft Article interface
interface DraftArticle {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  summary: string;
  publishDate: string;
  author: string;
  category: string;
  originalArticleId?: string;
  createdAt?: string;
  updatedAt?: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string | string[];
  };
  image?: string;
}

// Draft News interface
interface DraftNews {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  summary: string;
  publishDate: string;
  category: string;
  originalNewsId?: string;
  createdAt?: string;
  updatedAt?: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string | string[];
  };
  image?: string;
  isFeatured?: boolean;
}

const DraftsView = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [draftArticles, setDraftArticles] = useState<DraftArticle[]>([]);
  const [draftNews, setDraftNews] = useState<DraftNews[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Editor states
  const [editingArticleDraft, setEditingArticleDraft] = useState<DraftArticle | null>(null);
  const [editingNewsDraft, setEditingNewsDraft] = useState<DraftNews | null>(null);
  const [articleEditorOpen, setArticleEditorOpen] = useState(false);
  const [newsEditorOpen, setNewsEditorOpen] = useState(false);
  const [articleEditorActiveTab, setArticleEditorActiveTab] = useState("basic");
  const [newsEditorActiveTab, setNewsEditorActiveTab] = useState("basic");
  const [savingArticle, setSavingArticle] = useState(false);
  const [savingNews, setSavingNews] = useState(false);

  useEffect(() => {
    fetchDraftArticles();
    fetchDraftNews();
  }, []);

  const fetchDraftArticles = async () => {
    setLoadingArticles(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/admin/drafts/articles', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch draft articles');
      }

      const data = await response.json();
      setDraftArticles(data);
    } catch (error) {
      console.error('Error fetching draft articles:', error);
      toast({
        title: 'Error fetching draft articles',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchDraftNews = async () => {
    setLoadingNews(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/admin/drafts/news', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch draft news');
      }

      const data = await response.json();
      setDraftNews(data);
    } catch (error) {
      console.error('Error fetching draft news:', error);
      toast({
        title: 'Error fetching draft news',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoadingNews(false);
    }
  };

  // Update fields functions
  const updateArticleDraft = (field: string, value: any) => {
    if (!editingArticleDraft) return;
    
    setEditingArticleDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const updateNewsDraft = (field: string, value: any) => {
    if (!editingNewsDraft) return;
    
    setEditingNewsDraft(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Edit draft functions
  const handleEditDraftArticle = async (draftId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/admin/drafts/articles/${draftId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch draft article');
      }
      
      const draftData = await response.json();
      setEditingArticleDraft({
        ...draftData,
        id: draftId,
        _id: draftId
      });
      setArticleEditorActiveTab("basic");
      setArticleEditorOpen(true);
    } catch (error) {
      console.error('Error preparing draft for edit:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to edit draft',
        variant: 'destructive',
      });
    }
  };

  const handleEditDraftNews = async (draftId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/admin/drafts/news/${draftId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch draft news');
      }
      
      const draftData = await response.json();
      setEditingNewsDraft({
        ...draftData,
        id: draftId,
        _id: draftId
      });
      setNewsEditorActiveTab("basic");
      setNewsEditorOpen(true);
    } catch (error) {
      console.error('Error preparing draft for edit:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to edit draft',
        variant: 'destructive',
      });
    }
  };

  // Save draft functions
  const handleSaveArticleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingArticleDraft) return;
    
    setSavingArticle(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const draftId = editingArticleDraft._id || editingArticleDraft.id;
      
      const response = await fetch(`/api/admin/drafts/articles/${draftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editingArticleDraft)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update draft article');
      }
      
      toast({
        title: 'Success',
        description: 'Draft article updated successfully',
      });
      
      // Refresh drafts list
      fetchDraftArticles();
      
      // Close editor
      setArticleEditorOpen(false);
    } catch (error) {
      console.error('Error updating draft article:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update draft',
        variant: 'destructive',
      });
    } finally {
      setSavingArticle(false);
    }
  };

  const handleSaveNewsDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingNewsDraft) return;
    
    setSavingNews(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const draftId = editingNewsDraft._id || editingNewsDraft.id;
      
      const response = await fetch(`/api/admin/drafts/news/${draftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editingNewsDraft)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update draft news');
      }
      
      toast({
        title: 'Success',
        description: 'Draft news updated successfully',
      });
      
      // Refresh drafts list
      fetchDraftNews();
      
      // Close editor
      setNewsEditorOpen(false);
    } catch (error) {
      console.error('Error updating draft news:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update draft',
        variant: 'destructive',
      });
    } finally {
      setSavingNews(false);
    }
  };

  // Delete draft functions
  const handleDeleteDraftArticle = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/drafts/articles/${draftId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete draft article');
      }

      // Update UI by removing the deleted draft
      setDraftArticles(draftArticles.filter(
        draft => (draft.id !== draftId && draft._id !== draftId)
      ));

      toast({
        title: 'Draft article deleted',
        description: 'The draft article has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting draft article:', error);
      toast({
        title: 'Error deleting draft article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDraftNews = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft news item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/drafts/news/${draftId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete draft news item');
      }

      // Update UI by removing the deleted draft
      setDraftNews(draftNews.filter(
        draft => (draft.id !== draftId && draft._id !== draftId)
      ));

      toast({
        title: 'Draft news item deleted',
        description: 'The draft news item has been deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting draft news:', error);
      toast({
        title: 'Error deleting draft news',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  // Publish draft functions
  const handlePublishDraftArticle = async (draftId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/drafts/articles/${draftId}/publish`, {
        method: 'POST',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to publish draft article');
      }

      // Update UI by removing the published draft
      setDraftArticles(draftArticles.filter(
        draft => (draft.id !== draftId && draft._id !== draftId)
      ));

      toast({
        title: 'Draft article published',
        description: 'The draft article has been published successfully',
        variant: 'default',
      });

      // Close editor if it's open
      if (articleEditorOpen && editingArticleDraft && 
          (editingArticleDraft.id === draftId || editingArticleDraft._id === draftId)) {
        setArticleEditorOpen(false);
      }
    } catch (error) {
      console.error('Error publishing draft article:', error);
      toast({
        title: 'Error publishing draft article',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handlePublishDraftNews = async (draftId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/admin/drafts/news/${draftId}/publish`, {
        method: 'POST',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to publish draft news item');
      }

      // Update UI by removing the published draft
      setDraftNews(draftNews.filter(
        draft => (draft.id !== draftId && draft._id !== draftId)
      ));

      toast({
        title: 'Draft news item published',
        description: 'The draft news item has been published successfully',
        variant: 'default',
      });

      // Close editor if it's open
      if (newsEditorOpen && editingNewsDraft && 
          (editingNewsDraft.id === draftId || editingNewsDraft._id === draftId)) {
        setNewsEditorOpen(false);
      }
    } catch (error) {
      console.error('Error publishing draft news:', error);
      toast({
        title: 'Error publishing draft news',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Drafts</h2>
      <p className="text-gray-600 mb-6">
        Manage your draft articles and news items before publishing
      </p>

      {/* Article Draft Editor Dialog */}
      <Dialog open={articleEditorOpen} onOpenChange={setArticleEditorOpen}>
        <DialogContent className="sm:max-w-[90%] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Draft Article</DialogTitle>
            <DialogDescription>
              Make changes to your draft article. Click Save to update your draft or Publish to make it live.
            </DialogDescription>
          </DialogHeader>
          
          {editingArticleDraft && (
            <form onSubmit={handleSaveArticleDraft}>
              <Tabs 
                value={articleEditorActiveTab} 
                onValueChange={setArticleEditorActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                </TabsList>
                
                {/* Basic Info Tab */}
                <TabsContent value="basic">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          value={editingArticleDraft.title || ''} 
                          onChange={(e) => updateArticleDraft('title', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea 
                          id="summary" 
                          value={editingArticleDraft.summary || ''} 
                          onChange={(e) => updateArticleDraft('summary', e.target.value)}
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input 
                          id="category" 
                          value={editingArticleDraft.category || ''} 
                          onChange={(e) => updateArticleDraft('category', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input 
                          id="author" 
                          value={editingArticleDraft.author || ''} 
                          onChange={(e) => updateArticleDraft('author', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input 
                          id="image" 
                          value={editingArticleDraft.image || ''} 
                          onChange={(e) => updateArticleDraft('image', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Content Tab */}
                <TabsContent value="content">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea 
                        id="content" 
                        value={editingArticleDraft.content || ''} 
                        onChange={(e) => updateArticleDraft('content', e.target.value)}
                        rows={15}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* SEO Tab */}
                <TabsContent value="seo">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input 
                        id="metaTitle" 
                        value={editingArticleDraft.seo?.metaTitle || ''} 
                        onChange={(e) => updateArticleDraft('seo', {
                          ...editingArticleDraft.seo,
                          metaTitle: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea 
                        id="metaDescription" 
                        value={editingArticleDraft.seo?.metaDescription || ''} 
                        onChange={(e) => updateArticleDraft('seo', {
                          ...editingArticleDraft.seo,
                          metaDescription: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords (comma separated)</Label>
                      <Input 
                        id="keywords" 
                        value={
                          Array.isArray(editingArticleDraft.seo?.keywords) 
                            ? editingArticleDraft.seo?.keywords.join(', ') 
                            : editingArticleDraft.seo?.keywords || ''
                        } 
                        onChange={(e) => updateArticleDraft('seo', {
                          ...editingArticleDraft.seo,
                          keywords: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6 flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setArticleEditorOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    const draftId = editingArticleDraft._id || editingArticleDraft.id;
                    if (draftId) {
                      handlePublishDraftArticle(draftId);
                    }
                  }}
                  disabled={savingArticle}
                >
                  {savingArticle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Publish
                </Button>
                <Button type="submit" disabled={savingArticle}>
                  {savingArticle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* News Draft Editor Dialog */}
      <Dialog open={newsEditorOpen} onOpenChange={setNewsEditorOpen}>
        <DialogContent className="sm:max-w-[90%] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Draft News</DialogTitle>
            <DialogDescription>
              Make changes to your draft news. Click Save to update your draft or Publish to make it live.
            </DialogDescription>
          </DialogHeader>
          
          {editingNewsDraft && (
            <form onSubmit={handleSaveNewsDraft}>
              <Tabs 
                value={newsEditorActiveTab} 
                onValueChange={setNewsEditorActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                </TabsList>
                
                {/* Basic Info Tab */}
                <TabsContent value="basic">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          value={editingNewsDraft.title || ''} 
                          onChange={(e) => updateNewsDraft('title', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea 
                          id="summary" 
                          value={editingNewsDraft.summary || ''} 
                          onChange={(e) => updateNewsDraft('summary', e.target.value)}
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input 
                          id="category" 
                          value={editingNewsDraft.category || ''} 
                          onChange={(e) => updateNewsDraft('category', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input 
                          id="image" 
                          value={editingNewsDraft.image || ''} 
                          onChange={(e) => updateNewsDraft('image', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isFeatured" 
                            checked={editingNewsDraft.isFeatured || false}
                            onCheckedChange={(checked) => updateNewsDraft('isFeatured', checked)}
                          />
                          <Label htmlFor="isFeatured">Featured News</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Content Tab */}
                <TabsContent value="content">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea 
                        id="content" 
                        value={editingNewsDraft.content || ''} 
                        onChange={(e) => updateNewsDraft('content', e.target.value)}
                        rows={15}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* SEO Tab */}
                <TabsContent value="seo">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input 
                        id="metaTitle" 
                        value={editingNewsDraft.seo?.metaTitle || ''} 
                        onChange={(e) => updateNewsDraft('seo', {
                          ...editingNewsDraft.seo,
                          metaTitle: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea 
                        id="metaDescription" 
                        value={editingNewsDraft.seo?.metaDescription || ''} 
                        onChange={(e) => updateNewsDraft('seo', {
                          ...editingNewsDraft.seo,
                          metaDescription: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords (comma separated)</Label>
                      <Input 
                        id="keywords" 
                        value={
                          Array.isArray(editingNewsDraft.seo?.keywords) 
                            ? editingNewsDraft.seo?.keywords.join(', ') 
                            : editingNewsDraft.seo?.keywords || ''
                        }
                        onChange={(e) => updateNewsDraft('seo', {
                          ...editingNewsDraft.seo,
                          keywords: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6 flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setNewsEditorOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    const draftId = editingNewsDraft._id || editingNewsDraft.id;
                    if (draftId) {
                      handlePublishDraftNews(draftId);
                    }
                  }}
                  disabled={savingNews}
                >
                  {savingNews ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Publish
                </Button>
                <Button type="submit" disabled={savingNews}>
                  {savingNews ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="articles">
        <TabsList className="mb-4">
          <TabsTrigger value="articles" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-1">
            <Newspaper className="w-4 h-4" />
            News
          </TabsTrigger>
        </TabsList>

        {/* Article Drafts */}
        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Draft Articles</CardTitle>
              <CardDescription>These articles are saved as drafts and not yet published</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingArticles ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                          No draft articles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      draftArticles.map((draft) => (
                        <TableRow key={draft.id || draft._id}>
                          <TableCell className="font-medium">{draft.title}</TableCell>
                          <TableCell>{draft.author}</TableCell>
                          <TableCell>{draft.category}</TableCell>
                          <TableCell>
                            {new Date(draft.updatedAt || draft.createdAt || draft.publishDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditDraftArticle(draft.id || draft._id || "")}
                                title="Edit Draft"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePublishDraftArticle(draft.id || draft._id || "")}
                                className="text-green-500 hover:text-green-700"
                                title="Publish Draft"
                              >
                                <FileCheck className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDraftArticle(draft.id || draft._id || "")}
                                className="text-red-500 hover:text-red-700"
                                title="Delete Draft"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/articles')}
                className="ml-auto"
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Create New Article
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* News Drafts */}
        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Draft News</CardTitle>
              <CardDescription>These news items are saved as drafts and not yet published</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingNews ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftNews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                          No draft news found
                        </TableCell>
                      </TableRow>
                    ) : (
                      draftNews.map((draft) => (
                        <TableRow key={draft.id || draft._id}>
                          <TableCell className="font-medium">{draft.title}</TableCell>
                          <TableCell>{draft.category}</TableCell>
                          <TableCell>{draft.isFeatured ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            {new Date(draft.updatedAt || draft.createdAt || draft.publishDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditDraftNews(draft.id || draft._id || "")}
                                title="Edit Draft"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePublishDraftNews(draft.id || draft._id || "")}
                                className="text-green-500 hover:text-green-700"
                                title="Publish Draft"
                              >
                                <FileCheck className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDraftNews(draft.id || draft._id || "")}
                                className="text-red-500 hover:text-red-700"
                                title="Delete Draft"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/news')}
                className="ml-auto"
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Create New News Item
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DraftsView;