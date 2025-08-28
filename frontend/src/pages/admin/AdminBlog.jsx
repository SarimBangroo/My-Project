import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Search,
  Filter,
  Wand2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [generating, setGenerating] = useState(false);
  
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'destinations',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    seoKeywords: [],
    featuredImage: '',
    scheduledFor: ''
  });

  const [aiForm, setAIForm] = useState({
    topic: '',
    category: 'destinations',
    keywords: [],
    targetLength: 1500,
    tone: 'informative',
    focusAreas: []
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/blog/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPostForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAIInputChange = (field, value) => {
    setAIForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setPostForm({
      title: '',
      content: '',
      excerpt: '',
      category: 'destinations',
      tags: [],
      metaTitle: '',
      metaDescription: '',
      seoKeywords: [],
      featuredImage: '',
      scheduledFor: ''
    });
    setEditingPost(null);
  };

  const resetAIForm = () => {
    setAIForm({
      topic: '',
      category: 'destinations',
      keywords: [],
      targetLength: 1500,
      tone: 'informative',
      focusAreas: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Process arrays
      const submitData = {
        ...postForm,
        tags: Array.isArray(postForm.tags) ? postForm.tags : postForm.tags.split(',').map(t => t.trim()).filter(t => t),
        seoKeywords: Array.isArray(postForm.seoKeywords) ? postForm.seoKeywords : postForm.seoKeywords.split(',').map(k => k.trim()).filter(k => k),
        scheduledFor: postForm.scheduledFor ? new Date(postForm.scheduledFor).toISOString() : null
      };
      
      if (editingPost) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/admin/blog/posts/${editingPost.id}`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Blog post updated successfully!');
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/admin/blog/posts`,
          submitData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Blog post created successfully!');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error(error.response?.data?.detail || 'Failed to save blog post');
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    
    try {
      setGenerating(true);
      const token = localStorage.getItem('adminToken');
      
      const submitData = {
        ...aiForm,
        keywords: Array.isArray(aiForm.keywords) ? aiForm.keywords : aiForm.keywords.split(',').map(k => k.trim()).filter(k => k),
        focusAreas: Array.isArray(aiForm.focusAreas) ? aiForm.focusAreas : aiForm.focusAreas.split(',').map(f => f.trim()).filter(f => f)
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/blog/generate`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('AI blog post generated successfully! It\'s pending approval.');
      setIsAIDialogOpen(false);
      resetAIForm();
      fetchPosts();
    } catch (error) {
      console.error('Error generating AI blog post:', error);
      toast.error(error.response?.data?.detail || 'Failed to generate blog post');
    } finally {
      setGenerating(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      seoKeywords: Array.isArray(post.seoKeywords) ? post.seoKeywords.join(', ') : post.seoKeywords,
      featuredImage: post.featuredImage || '',
      scheduledFor: post.scheduledFor ? post.scheduledFor.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin/blog/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Blog post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleStatusChange = async (post, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/admin/blog/posts/${post.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Blog post ${newStatus === 'published' ? 'published' : 'updated'} successfully!`);
      fetchPosts();
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Failed to update blog status');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      destinations: 'bg-blue-100 text-blue-800',
      travel_tips: 'bg-green-100 text-green-800',
      culture: 'bg-purple-100 text-purple-800',
      adventure: 'bg-red-100 text-red-800',
      photography: 'bg-yellow-100 text-yellow-800',
      seasonal: 'bg-orange-100 text-orange-800',
      news: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-slate-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Blog Management</h1>
                  <p className="text-slate-600">Create and manage blog posts with AI assistance</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => resetAIForm()}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                      AI Blog Generator
                    </DialogTitle>
                    <DialogDescription>
                      Let AI create engaging blog content about Kashmir travel
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleGenerateAI} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Topic</label>
                        <Input
                          value={aiForm.topic}
                          onChange={(e) => handleAIInputChange('topic', e.target.value)}
                          placeholder="e.g., Best places to visit in Kashmir"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Select value={aiForm.category} onValueChange={(value) => handleAIInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="destinations">Destinations</SelectItem>
                            <SelectItem value="travel_tips">Travel Tips</SelectItem>
                            <SelectItem value="culture">Culture</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Keywords (comma-separated)</label>
                        <Input
                          value={aiForm.keywords}
                          onChange={(e) => handleAIInputChange('keywords', e.target.value)}
                          placeholder="Kashmir, travel, sightseeing"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Target Length (words)</label>
                        <Input
                          type="number"
                          value={aiForm.targetLength}
                          onChange={(e) => handleAIInputChange('targetLength', parseInt(e.target.value))}
                          min="500"
                          max="3000"
                          placeholder="1500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tone</label>
                        <Select value={aiForm.tone} onValueChange={(value) => handleAIInputChange('tone', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="informative">Informative</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="exciting">Exciting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Focus Areas (comma-separated)</label>
                        <Input
                          value={aiForm.focusAreas}
                          onChange={(e) => handleAIInputChange('focusAreas', e.target.value)}
                          placeholder="local culture, adventure activities"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        disabled={generating}
                      >
                        {generating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Blog Post
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAIDialogOpen(false)}
                        className="flex-1"
                        disabled={generating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => resetForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </DialogTitle>
                    <DialogDescription>
                      Create engaging content about Kashmir travel and tourism
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={postForm.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter blog post title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Content</label>
                      <Textarea
                        value={postForm.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="Write your blog content here..."
                        rows={12}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Excerpt</label>
                      <Textarea
                        value={postForm.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="Brief summary of the blog post"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Select value={postForm.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="destinations">Destinations</SelectItem>
                            <SelectItem value="travel_tips">Travel Tips</SelectItem>
                            <SelectItem value="culture">Culture</SelectItem>
                            <SelectItem value="adventure">Adventure</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                        <Input
                          value={postForm.featuredImage}
                          onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                      <Input
                        value={postForm.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        placeholder="Kashmir, travel, sightseeing"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Meta Title</label>
                        <Input
                          value={postForm.metaTitle}
                          onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                          placeholder="SEO title (60 characters)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">SEO Keywords (comma-separated)</label>
                        <Input
                          value={postForm.seoKeywords}
                          onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                          placeholder="kashmir tourism, travel guide"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Description</label>
                      <Textarea
                        value={postForm.metaDescription}
                        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                        placeholder="SEO description (160 characters)"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Schedule Publication (optional)</label>
                      <Input
                        type="date"
                        value={postForm.scheduledFor}
                        onChange={(e) => handleInputChange('scheduledFor', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                        {editingPost ? 'Update Post' : 'Create Post'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Posts</p>
                  <p className="text-3xl font-bold text-slate-800">{posts.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Published</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {posts.filter(p => p.status === 'published').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pending Approval</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {posts.filter(p => p.status === 'pending_approval').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">AI Generated</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {posts.filter(p => p.isAIGenerated).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-2 w-full lg:w-auto">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-80"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-slate-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending_approval">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="destinations">Destinations</SelectItem>
                    <SelectItem value="travel_tips">Travel Tips</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              {post.featuredImage && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category.replace('_', ' ')}
                    </Badge>
                    <Badge className={getStatusColor(post.status)}>
                      {post.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {post.isAIGenerated && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="space-y-2 mb-4 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  {post.publishedAt && (
                    <div className="flex justify-between">
                      <span>Published:</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span>{post.views || 0}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(post)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  
                  {post.status === 'pending_approval' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(post, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  )}
                  
                  {post.status === 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(post, 'published')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Publish
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No blog posts found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first blog post'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <div className="flex space-x-4 justify-center">
                  <Button 
                    onClick={() => setIsAIDialogOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;