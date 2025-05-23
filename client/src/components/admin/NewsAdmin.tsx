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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Pencil, Trash2, Search, Newspaper, LayoutGrid } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

// News interface based on the MongoDB model
interface News {
  id: string;
  _id?: string;  // Support both formats
  title: string;
  content: string;
  summary: string;
  publishDate: string;
  image?: string;
  category: string;
  isFeatured: boolean;
  isDraft?: boolean; // Flag to indicate if it's a draft
  slug: string;
  relatedArticles: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  views: number;
  readingTime: string;
  helpful: {
    yes: number;
    no: number;
  };
  tableOfContents: {
    id: string;
    title: string;
    level: number;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Initial empty news for creating new news items
const emptyNews: Omit<News, '_id' | 'id'> = {
  title: "",
  content: "",
  summary: "",
  publishDate: new Date().toISOString(),
  image: "",
  category: "",
  isFeatured: false,
  slug: "",
  relatedArticles: [],
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: []
  },
  views: 0,
  readingTime: "",
  helpful: {
    yes: 0,
    no: 0
  },
  tableOfContents: [],
  faqs: []
};

const NewsAdmin = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [editForm, setEditForm] = useState<Omit<News, '_id' | 'id'>>(emptyNews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
    
    // Check if we're editing a draft
    const editingDraftData = sessionStorage.getItem('editingDraft');
    if (editingDraftData) {
      try {
        const draftInfo = JSON.parse(editingDraftData);
        if (draftInfo.type === 'news') {
          // We're editing a news draft
          setIsEditing(true);
          setEditForm(draftInfo.data);
          setCurrentNews(draftInfo.data);
          setDialogOpen(true);
          setActiveTab("basic");
          
          // Clear the session storage so we don't repeatedly open the edit dialog
          sessionStorage.removeItem('editingDraft');
        }
      } catch (e) {
        console.error('Error parsing draft data', e);
        sessionStorage.removeItem('editingDraft');
      }
    }
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Fetch published news
      const newsResponse = await fetch('/api/news');
      if (!newsResponse.ok) {
        throw new Error('Failed to fetch news');
      }
      const publishedNews = await newsResponse.json();
      
      // Mark published news
      const publishedWithFlag = publishedNews.map((item: News) => ({
        ...item,
        isDraft: false
      }));

      // Fetch draft news
      const draftsResponse = await fetch('/api/admin/drafts/news', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!draftsResponse.ok) {
        throw new Error('Failed to fetch draft news');
      }
      
      const draftNews = await draftsResponse.json();
      
      // Mark draft news
      const draftsWithFlag = draftNews.map((item: any) => ({
        ...item,
        isDraft: true
      }));
      
      // Combine both published and draft news
      const allNews = [...publishedWithFlag, ...draftsWithFlag];
      setNews(allNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Error fetching news',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditForm(emptyNews);
    setCurrentNews(null);
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handleEdit = async (newsItem: News) => {
    setIsEditing(true);
    
    // If news item is a draft, get the latest version from the drafts API
    if (newsItem.isDraft) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const draftId = newsItem.id || newsItem._id;
        if (!draftId) {
          throw new Error('Invalid draft ID');
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
        // Mark it as a draft for the edit form
        const fullDraftData = {
          ...draftData,
          id: draftId,
          _id: draftId,
          isDraft: true
        };
        
        setEditForm(fullDraftData);
        setCurrentNews(fullDraftData);
      } catch (error) {
        console.error('Error fetching draft news for edit:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to edit draft',
          variant: 'destructive',
        });
        // Still open the dialog with the existing data
        setEditForm(newsItem);
        setCurrentNews(newsItem);
      }
    } else {
      // Regular published news
      setEditForm(newsItem);
      setCurrentNews(newsItem);
    }
    
    setDialogOpen(true);
    setActiveTab("basic");
  };

  const handlePublishDraft = async (draftId: string) => {
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
        throw new Error('Failed to publish draft news');
      }

      const publishedData = await response.json();
      
      // Update UI - remove the draft and add the published news
      setNews(prev => {
        // Remove the draft
        const filtered = prev.filter(item => 
          (item.id !== draftId && item._id !== draftId)
        );
        
        // Add the published news
        if (publishedData.news) {
          return [...filtered, {
            ...publishedData.news,
            isDraft: false
          }];
        }
        
        return filtered;
      });

      toast({
        title: 'Draft published',
        description: 'The draft news item has been published successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error publishing draft news:', error);
      toast({
        title: 'Error publishing draft',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (newsId: string, isDraft = false) => {
    if (!confirm(`Are you sure you want to delete this ${isDraft ? 'draft' : 'news item'}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Use appropriate endpoint based on whether it's a draft or published
      const endpoint = isDraft 
        ? `/api/admin/drafts/news/${newsId}` 
        : `/api/admin/news/${newsId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${isDraft ? 'draft' : 'news item'}`);
      }

      // Update the UI by removing the deleted news item
      setNews(news.filter(item => 
        !(item._id === newsId || item.id === newsId)
      ));
      
      toast({
        title: isDraft ? 'Draft deleted' : 'News item deleted',
        description: `The ${isDraft ? 'draft' : 'news item'} has been deleted successfully`,
        variant: 'default',
      });
    } catch (error) {
      console.error(`Error deleting ${isDraft ? 'draft' : 'news item'}:`, error);
      toast({
        title: `Error deleting ${isDraft ? 'draft' : 'news item'}`,
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (asDraft = false) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Make sure we have required fields
      if (!editForm.title || !editForm.content || !editForm.summary) {
        throw new Error('Title, content, and summary are required');
      }

      // Determine if we're saving as a draft or publishing
      let url;
      let method;
      
      // Get the item ID
      const newsId = currentNews?.id || currentNews?._id;
      
      if (isEditing) {
        // If editing an existing item
        if (currentNews?.isDraft) {
          // If editing a draft, always use the draft endpoint
          url = `/api/admin/drafts/news/${newsId}`;
        } else {
          // If editing a published item
          url = `/api/admin/news/${newsId}`;
        }
        method = 'PUT';
      } else {
        // Creating a new item
        if (asDraft) {
          // Save as draft
          url = '/api/admin/drafts/news';
        } else {
          // Publish directly
          url = '/api/admin/news';
        }
        method = 'POST';
      }
      
      // Convert keywords from string to array if it's a string
      const submissionData = {
        ...editForm,
        seo: {
          ...editForm.seo,
          keywords: Array.isArray(editForm.seo.keywords) 
            ? editForm.seo.keywords 
            : (typeof editForm.seo.keywords === 'string' 
              ? (editForm.seo.keywords as string).split(',').map((k: string) => k.trim()).filter(Boolean) 
              : [])
        }
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save news item');
      }

      const savedNews = await response.json();
      
      // Only update the news list if not saving as draft
      if (!asDraft) {
        if (isEditing) {
          // Update existing news in the list
          setNews(news.map(item => {
            // Handle both ID formats by comparing with both
            const matchesId = 
              (item._id === savedNews._id) || 
              (item.id === savedNews.id) ||
              (item._id === savedNews.id) ||
              (item.id === savedNews._id);
            return matchesId ? savedNews : item;
          }));
        } else {
          // Add new news to the list
          setNews([...news, savedNews]);
        }
      }
      
      setDialogOpen(false);
      toast({
        title: asDraft 
          ? 'Draft saved' 
          : (isEditing ? 'News item updated' : 'News item created'),
        description: asDraft 
          ? 'The news item has been saved as a draft'
          : (isEditing 
            ? 'The news item has been updated successfully' 
            : 'A new news item has been created successfully'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: asDraft ? 'Error saving draft' : 'Error saving news item',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditForm({
        ...editForm,
        [parent]: {
          ...editForm[parent as keyof typeof editForm],
          [child]: value
        }
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setEditForm({
      ...editForm,
      [name]: checked
    });
  };
  
  const handleRichTextChange = (content: string) => {
    setEditForm({
      ...editForm,
      content
    });
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">News</h2>
          <p className="text-slate-500 mt-2">
            Manage all your news items
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create News
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search news..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <Newspaper className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500 py-10">
                          No news items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredNews.map((item) => (
                        <TableRow key={item.id || item._id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            {new Date(item.publishDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {!item.isDraft ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                Draft
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.isFeatured ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                No
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {item.isDraft && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-500 hover:text-green-700"
                                  onClick={() => {
                                    // Ensure we have a valid ID
                                    const id = item.id || item._id;
                                    if (id) {
                                      handlePublishDraft(id);
                                    }
                                  }}
                                  title="Publish Draft"
                                >
                                  <span className="sr-only">Publish</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                    <polyline points="16 6 12 2 8 6"></polyline>
                                    <line x1="12" y1="2" x2="12" y2="15"></line>
                                  </svg>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(item)}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  // Ensure we have a valid ID
                                  const id = item.id || item._id;
                                  if (id) {
                                    handleDelete(id, item.isDraft || false);
                                  }
                                }}
                                title="Delete"
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
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNews.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-10">
                  No news items found
                </div>
              ) : (
                filteredNews.map((item) => (
                  <Card key={item.id || item._id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-ellipsis overflow-hidden whitespace-nowrap" title={item.title}>
                        {item.title}
                      </CardTitle>
                      <CardDescription className="flex justify-between">
                        <span>{item.category}</span>
                        <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {item.summary}
                      </p>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <div>
                        {item.isFeatured && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(item.id || item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* News Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit News Item" : "Create News Item"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the news item"
                : "Add a new news item to your collection"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO & Metadata</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    placeholder="News title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={editForm.summary}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the news"
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={editForm.category}
                      onChange={handleInputChange}
                      placeholder="News category"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input
                      id="publishDate"
                      name="publishDate"
                      type="date"
                      value={editForm.publishDate.split('T')[0]}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={editForm.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={editForm.isFeatured}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('isFeatured', checked as boolean)
                    }
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Feature this news item
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  content={editForm.content}
                  onChange={handleRichTextChange}
                  placeholder="Start writing your news content..."
                  className="min-h-[400px]"
                />
                <p className="text-xs text-slate-500">
                  Supports rich text formatting and markdown
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="readingTime">Reading Time</Label>
                <Input
                  id="readingTime"
                  name="readingTime"
                  value={editForm.readingTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 5 min read"
                />
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo.metaTitle">Meta Title</Label>
                <Input
                  id="seo.metaTitle"
                  name="seo.metaTitle"
                  value={editForm.seo.metaTitle}
                  onChange={handleInputChange}
                  placeholder="SEO meta title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.metaDescription">Meta Description</Label>
                <Textarea
                  id="seo.metaDescription"
                  name="seo.metaDescription"
                  value={editForm.seo.metaDescription}
                  onChange={handleInputChange}
                  placeholder="SEO meta description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo.keywords">Keywords</Label>
                <Textarea
                  id="seo.keywords"
                  name="seo.keywords"
                  value={Array.isArray(editForm.seo.keywords) ? editForm.seo.keywords.join(', ') : String(editForm.seo.keywords || '')}
                  onChange={(e) => {
                    // Store as string and convert on submit
                    setEditForm(prev => ({
                      ...prev,
                      seo: {
                        ...prev.seo,
                        keywords: e.target.value
                      }
                    }));
                  }}
                  placeholder="Enter keywords separated by commas (e.g., news, education, visa)"
                  rows={2}
                />
                <p className="text-xs text-slate-500">
                  Separate keywords with commas (e.g., news, visa, study abroad)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={handleInputChange}
                  placeholder="news-url-slug"
                />
                <p className="text-xs text-slate-500">
                  Will be generated automatically if left blank
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleSubmit(true)}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Draft...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              type="button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update News" : "Create News"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsAdmin;