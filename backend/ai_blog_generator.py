"""
AI Blog Generator Service for G.M.B Travels Kashmir
Generates travel blog posts about Kashmir using AI models
"""

import asyncio
import logging
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import re
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AIBlogGenerator:
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY")
        self.default_model = "gpt-4o-mini"
        self.default_provider = "openai"
        
    def get_chat_client(self, model: str = None, provider: str = None):
        """Get configured LLM chat client"""
        model = model or self.default_model
        provider = provider or self.default_provider
        
        chat = LlmChat(
            api_key=self.api_key,
            session_id=f"blog_generator_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            system_message=self._get_system_prompt()
        )
        
        return chat.with_model(provider, model)
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for blog generation"""
        return """You are a professional travel content writer specializing in Kashmir tourism. 
        You work for G.M.B Travels Kashmir and create engaging, informative blog posts that inspire travelers 
        to visit Kashmir while showcasing the company's expertise.

        Your writing style should be:
        - Engaging and descriptive
        - Informative yet accessible
        - Emotionally compelling
        - SEO-friendly
        - Culturally sensitive
        - Focused on the beauty and experiences Kashmir offers

        Always include practical travel tips, local insights, and subtle mentions of tour packages 
        and services that G.M.B Travels Kashmir provides. Focus on creating content that builds trust 
        and positions the company as local experts."""
    
    async def generate_blog_post(
        self,
        topic: str,
        category: str,
        keywords: List[str] = None,
        target_length: int = 1500,
        tone: str = "informative",
        focus_areas: List[str] = None,
        model: str = None,
        provider: str = None
    ) -> Dict:
        """Generate a complete blog post using AI"""
        try:
            chat = self.get_chat_client(model, provider)
            keywords = keywords or []
            focus_areas = focus_areas or []
            
            # Create the generation prompt
            prompt = self._create_generation_prompt(
                topic, category, keywords, target_length, tone, focus_areas
            )
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse the AI response into structured data
            blog_data = self._parse_ai_response(response, topic, category, keywords)
            blog_data["aiModel"] = f"{provider or self.default_provider}/{model or self.default_model}"
            blog_data["generationPrompt"] = prompt
            
            return blog_data
            
        except Exception as e:
            logger.error(f"Error generating blog post: {e}")
            raise Exception(f"Blog generation failed: {str(e)}")
    
    def _create_generation_prompt(
        self,
        topic: str,
        category: str,
        keywords: List[str],
        target_length: int,
        tone: str,
        focus_areas: List[str]
    ) -> str:
        """Create a detailed prompt for blog generation"""
        
        keyword_text = ", ".join(keywords) if keywords else "Kashmir tourism, travel guide"
        focus_text = ", ".join(focus_areas) if focus_areas else "local experiences, travel tips"
        
        prompt = f"""Create a comprehensive blog post for G.M.B Travels Kashmir with the following specifications:

TOPIC: {topic}
CATEGORY: {category}
TARGET LENGTH: {target_length} words
TONE: {tone}
KEYWORDS TO INCLUDE: {keyword_text}
FOCUS AREAS: {focus_text}

Please structure your response EXACTLY as follows:

BLOG_TITLE: [Create an engaging, SEO-friendly title]

BLOG_SLUG: [Create a URL-friendly slug based on the title]

META_TITLE: [Create a 60-character SEO title]

META_DESCRIPTION: [Create a 160-character meta description]

EXCERPT: [Write a compelling 200-word excerpt that summarizes the post]

BLOG_CONTENT:
[Write the full blog post content here. Include:
- Engaging introduction
- Well-structured sections with subheadings
- Practical travel tips
- Local insights and cultural information
- Subtle mentions of G.M.B Travels Kashmir services
- Call-to-action encouraging readers to book tours
- Conclusion that inspires action

Make it exactly {target_length} words, engaging, and informative.]

SEO_KEYWORDS: [List 8-10 relevant SEO keywords, comma-separated]

SUGGESTED_TAGS: [List 5-6 relevant blog tags, comma-separated]

Remember to:
- Write in {tone} tone
- Include natural mentions of Kashmir destinations
- Add practical travel advice
- Maintain cultural sensitivity
- Include seasonal travel tips where relevant
- Mention G.M.B Travels Kashmir's local expertise naturally
"""
        
        return prompt
    
    def _parse_ai_response(self, response: str, topic: str, category: str, keywords: List[str]) -> Dict:
        """Parse AI response into structured blog data"""
        try:
            # Extract different sections using regex
            title = self._extract_section(response, r"BLOG_TITLE:\s*(.+?)(?=\n|$)")
            slug = self._extract_section(response, r"BLOG_SLUG:\s*(.+?)(?=\n|$)")
            meta_title = self._extract_section(response, r"META_TITLE:\s*(.+?)(?=\n|$)")
            meta_description = self._extract_section(response, r"META_DESCRIPTION:\s*(.+?)(?=\n|$)")
            excerpt = self._extract_section(response, r"EXCERPT:\s*(.+?)(?=BLOG_CONTENT:|$)", multiline=True)
            content = self._extract_section(response, r"BLOG_CONTENT:\s*(.+?)(?=SEO_KEYWORDS:|$)", multiline=True)
            seo_keywords = self._extract_section(response, r"SEO_KEYWORDS:\s*(.+?)(?=\n|$)")
            tags = self._extract_section(response, r"SUGGESTED_TAGS:\s*(.+?)(?=\n|$)")
            
            # Process extracted data
            seo_keywords_list = [k.strip() for k in seo_keywords.split(",")] if seo_keywords else keywords
            tags_list = [t.strip() for t in tags.split(",")] if tags else []
            
            # Create slug if not provided
            if not slug:
                slug = self._create_slug(title or topic)
            
            return {
                "title": title or f"Discover {topic} in Kashmir",
                "slug": slug,
                "content": content or "Content generation failed. Please try again.",
                "excerpt": excerpt or f"Explore {topic} with G.M.B Travels Kashmir.",
                "category": category,
                "tags": tags_list,
                "metaTitle": meta_title or title,
                "metaDescription": meta_description or excerpt[:160] if excerpt else None,
                "seoKeywords": seo_keywords_list,
                "isAIGenerated": True,
                "generatedAt": datetime.utcnow()
            }
            
        except Exception as e:
            logger.error(f"Error parsing AI response: {e}")
            # Fallback response
            slug = self._create_slug(topic)
            return {
                "title": f"Discover {topic} in Kashmir",
                "slug": slug,
                "content": response,  # Use raw response as fallback
                "excerpt": f"Explore the beauty of {topic} in Kashmir with G.M.B Travels Kashmir.",
                "category": category,
                "tags": [category, "kashmir", "travel"],
                "metaTitle": f"{topic} in Kashmir - Travel Guide",
                "metaDescription": f"Discover {topic} in Kashmir. Complete travel guide with tips and insights.",
                "seoKeywords": keywords + ["kashmir", topic.lower()],
                "isAIGenerated": True,
                "generatedAt": datetime.utcnow()
            }
    
    def _extract_section(self, text: str, pattern: str, multiline: bool = False) -> str:
        """Extract a section from the AI response using regex"""
        flags = re.MULTILINE | re.DOTALL if multiline else re.MULTILINE
        match = re.search(pattern, text, flags)
        return match.group(1).strip() if match else ""
    
    def _create_slug(self, title: str) -> str:
        """Create a URL-friendly slug from title"""
        if not title:
            return f"kashmir-travel-{datetime.utcnow().strftime('%Y%m%d')}"
        
        # Convert to lowercase and replace spaces with hyphens
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[\s_-]+', '-', slug)
        slug = slug.strip('-')
        
        return slug[:50]  # Limit slug length
    
    async def generate_topic_suggestions(self, category: str, count: int = 5) -> List[str]:
        """Generate topic suggestions for a given category"""
        try:
            chat = self.get_chat_client()
            
            prompt = f"""Generate {count} engaging blog post topics for Kashmir tourism in the {category} category.
            
            Focus on:
            - Unique aspects of Kashmir
            - Seasonal attractions
            - Cultural experiences
            - Adventure activities
            - Local insights
            - Photography opportunities
            
            Return only the topic titles, one per line, without numbers or bullets.
            Make them specific, engaging, and SEO-friendly."""
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Split response into individual topics
            topics = [topic.strip() for topic in response.split('\n') if topic.strip()]
            return topics[:count]
            
        except Exception as e:
            logger.error(f"Error generating topic suggestions: {e}")
            return self._get_fallback_topics(category, count)
    
    def _get_fallback_topics(self, category: str, count: int) -> List[str]:
        """Get fallback topic suggestions if AI generation fails"""
        topics_by_category = {
            "destinations": [
                "Hidden Gems of Kashmir: Off-the-Beaten-Path Destinations",
                "Complete Guide to Dal Lake: Everything You Need to Know",
                "Gulmarg Through the Seasons: When to Visit and What to Expect",
                "Sonamarg: The Golden Meadow of Kashmir",
                "Pahalgam: A Paradise for Nature Lovers"
            ],
            "travel_tips": [
                "First-Time Kashmir Travel Guide: Essential Tips and Tricks",
                "Best Time to Visit Kashmir: A Month-by-Month Guide",
                "Kashmir Packing Checklist: What to Bring for Your Trip",
                "Local Transportation in Kashmir: Getting Around Like a Pro",
                "Kashmir Food Guide: Must-Try Local Dishes"
            ],
            "culture": [
                "Kashmir's Rich Cultural Heritage: Traditions and Festivals",
                "Kashmiri Handicrafts: A Guide to Local Arts and Crafts",
                "Traditional Kashmiri Architecture: From Houseboats to Shrines",
                "Kashmir's Musical Traditions: Folk Songs and Instruments",
                "Kashmiri Cuisine: A Culinary Journey Through Paradise"
            ],
            "adventure": [
                "Trekking in Kashmir: Best Trails for Every Skill Level",
                "Skiing in Gulmarg: Your Complete Guide to Kashmir's Slopes",
                "River Rafting in Kashmir: Thrilling Adventures on Mountain Rivers",
                "Camping Under Kashmir's Starlit Skies",
                "Photography Tours in Kashmir: Capturing Paradise"
            ],
            "photography": [
                "Best Photography Spots in Kashmir: A Photographer's Guide",
                "Kashmir in Different Seasons: A Visual Journey",
                "Capturing Kashmir's Wildlife: Photography Tips and Locations",
                "Golden Hour Photography in Kashmir: Tips and Techniques",
                "Portrait Photography in Kashmir: Cultural Sensitivity Guide"
            ]
        }
        
        default_topics = [
            "Kashmir Travel Guide: Planning Your Perfect Trip",
            "Exploring Kashmir with G.M.B Travels: Local Expertise",
            "Kashmir's Natural Beauty: A Photographer's Paradise",
            "Cultural Experiences in Kashmir: Beyond the Tourist Trail",
            "Adventure Activities in Kashmir: Thrills in Paradise"
        ]
        
        category_topics = topics_by_category.get(category, default_topics)
        return category_topics[:count]
    
    async def test_ai_connection(self) -> bool:
        """Test if AI connection is working"""
        try:
            chat = self.get_chat_client()
            test_message = UserMessage(text="Say 'AI connection test successful' and nothing else.")
            response = await chat.send_message(test_message)
            return "successful" in response.lower()
        except Exception as e:
            logger.error(f"AI connection test failed: {e}")
            return False

# Global instance
ai_blog_generator = AIBlogGenerator()