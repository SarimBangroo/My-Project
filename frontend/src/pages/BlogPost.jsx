import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Tag,
  User,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { useSiteSettings } from '../hooks/useSiteSettings';
import SEOHead from '../components/SEOHead';
import axios from 'axios';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { siteSettings } = useSiteSettings();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchRelatedPosts();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/blog/posts/${slug}`
      );
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      if (error.response?.status === 404) {
        toast.error('Blog post not found');
        navigate('/blog');
      } else {
        toast.error('Failed to load blog post');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/blog/posts?limit=3`
      );
      setRelatedPosts(response.data.filter(p => p.slug !== slug).slice(0, 3));
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // Here you would typically send a request to update likes
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content ? content.split(' ').length : 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
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

  const companyInfo = siteSettings?.companyInfo || {
    name: 'G.M.B Travels Kashmir'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
            <p className="text-slate-600">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Post Not Found</h2>
          <p className="text-slate-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button className="bg-amber-600 hover:bg-amber-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        keywords={post.seoKeywords || post.tags}
        ogImage={post.featuredImage}
      />

      {/* Hero Image */}
      {post.featuredImage && (
        <div className="relative h-96 bg-gradient-to-b from-transparent to-black/30">
          <img 
            src={post.featuredImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/blog">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <Badge className={getCategoryColor(post.category)}>
                  {post.category.replace('_', ' ')}
                </Badge>
                {post.isAIGenerated && (
                  <Badge className="ml-2 bg-purple-100 text-purple-800">
                    AI Enhanced
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {calculateReadTime(post.content)}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    {post.views || 0} views
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={liked ? 'text-red-600 border-red-200' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                    {liked ? 'Liked' : 'Like'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-800 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-amber-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Ready to Experience Kashmir?
              </h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Turn your Kashmir dreams into reality. Explore our carefully curated tour packages 
                and let {companyInfo.name} guide you through the paradise on earth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/packages">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                    View Tour Packages
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    {relatedPost.featuredImage && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={relatedPost.featuredImage} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <Badge className={getCategoryColor(relatedPost.category)} size="sm">
                        {relatedPost.category.replace('_', ' ')}
                      </Badge>
                      <Link to={`/blog/${relatedPost.slug}`}>
                        <h4 className="font-semibold text-slate-800 mt-3 mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
                          {relatedPost.title}
                        </h4>
                      </Link>
                      <p className="text-slate-600 text-sm line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center mt-4 text-xs text-slate-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;