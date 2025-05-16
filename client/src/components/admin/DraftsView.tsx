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
  FileEdit 
} from "lucide-react";
import { useLocation } from 'wouter';

// Draft Article interface
interface DraftArticle {
  id: string;
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
}

// Draft News interface
interface DraftNews {
  id: string;
  _id?: string;
  title: string;
  content: string;
  summary: string;
  publishDate: string;
  category: string;
  originalNewsId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DraftsView = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [draftArticles, setDraftArticles] = useState<DraftArticle[]>([]);
  const [draftNews, setDraftNews] = useState<DraftNews[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

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

  const handleEditDraftArticle = (draftId: string) => {
    navigate(`/admin/drafts/articles/edit/${draftId}`);
  };

  const handleEditDraftNews = (draftId: string) => {
    navigate(`/admin/drafts/news/edit/${draftId}`);
  };

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
        draft => draft.id !== draftId && draft._id !== draftId
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
        draft => draft.id !== draftId && draft._id !== draftId
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
        draft => draft.id !== draftId && draft._id !== draftId
      ));

      toast({
        title: 'Draft article published',
        description: 'The draft article has been published successfully',
        variant: 'default',
      });

      // Refresh the drafts list
      fetchDraftArticles();
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
        draft => draft.id !== draftId && draft._id !== draftId
      ));

      toast({
        title: 'Draft news item published',
        description: 'The draft news item has been published successfully',
        variant: 'default',
      });

      // Refresh the drafts list
      fetchDraftNews();
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Drafts</h2>
        <p className="text-slate-500 mt-2">
          Manage your draft articles and news items
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            Article Drafts
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            News Drafts
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
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftNews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-slate-500 py-10">
                          No draft news items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      draftNews.map((draft) => (
                        <TableRow key={draft.id || draft._id}>
                          <TableCell className="font-medium">{draft.title}</TableCell>
                          <TableCell>{draft.category}</TableCell>
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