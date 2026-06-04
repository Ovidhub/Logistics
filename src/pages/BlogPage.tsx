import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Search, MessageCircle } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of Global Logistics: AI & Automation in 2026',
    excerpt: 'Discover how artificial intelligence and automation are revolutionizing the logistics industry, making shipping faster and more efficient than ever before.',
    author: 'Sarah Johnson',
    date: 'Jan 15, 2026',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/4170172/pexels-photo-4170172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 24,
  },
  {
    id: 2,
    title: 'Sustainable Shipping: How Atrans Reduces Carbon Footprint',
    excerpt: 'Learn about our green initiatives, electric fleet adoption, and carbon-neutral shipping options that help businesses meet sustainability goals.',
    author: 'Michael Chen',
    date: 'Jan 10, 2026',
    category: 'Sustainability',
    image: 'https://images.pexels.com/photos/24246926/pexels-photo-24246926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 18,
  },
  {
    id: 3,
    title: 'Ocean Freight vs Air Freight: Choosing the Right Option',
    excerpt: 'A comprehensive comparison of ocean and air freight services to help you decide which option best suits your shipping needs and budget.',
    author: 'Emily Rodriguez',
    date: 'Jan 5, 2026',
    category: 'Guide',
    image: 'https://images.pexels.com/photos/32010721/pexels-photo-32010721.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 32,
  },
  {
    id: 4,
    title: 'Top 10 Customs Clearance Tips for International Shipping',
    excerpt: 'Avoid delays and extra costs with these expert tips on navigating customs clearance for your international shipments efficiently.',
    author: 'David Park',
    date: 'Dec 28, 2025',
    category: 'Tips',
    image: 'https://images.pexels.com/photos/15346128/pexels-photo-15346128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 45,
  },
  {
    id: 5,
    title: 'Warehouse Management: Best Practices for E-commerce',
    excerpt: 'Optimize your warehouse operations with proven strategies for inventory management, picking, packing, and order fulfillment.',
    author: 'Lisa Wang',
    date: 'Dec 20, 2025',
    category: 'Operations',
    image: 'https://images.pexels.com/photos/4487363/pexels-photo-4487363.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 27,
  },
  {
    id: 6,
    title: 'Real-Time Tracking: Why It Matters for Your Business',
    excerpt: 'Understand the importance of real-time shipment tracking and how it can improve customer satisfaction and reduce operational costs.',
    author: 'James Wilson',
    date: 'Dec 15, 2025',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/31310062/pexels-photo-31310062.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 21,
  },
];

const categories = ['All', 'Technology', 'Sustainability', 'Guide', 'Tips', 'Operations'];

export default function BlogPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      <PageBanner title="Our Blog" breadcrumb="Blog" />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Latest News</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">News & Insights</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and news from the world of logistics and shipping.
            </p>
          </div>

          {/* Search & Filter */}
          <div className={`bg-slate-50 rounded p-5 mb-8 border-l-4 ${c.border}`}>
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded border border-slate-300 text-sm focus:outline-none focus:ring-2 ${c.ring} focus:border-transparent bg-white`}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-xs font-bold rounded uppercase tracking-wider transition-colors ${
                      activeCategory === cat
                        ? `${c.bg} text-white`
                        : `bg-white text-slate-700 hover:${c.bgLight} border border-slate-200`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded shadow-sm overflow-hidden hover:shadow-xl transition-shadow border border-slate-100 group"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-4 left-4 ${c.bg} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </div>
                    </div>
                    <h3 className={`text-lg font-extrabold text-slate-900 mb-3 leading-snug group-hover:${c.text} transition-colors line-clamp-2`}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <button className={`inline-flex items-center gap-2 ${c.text} hover:opacity-80 text-sm font-bold transition-colors`}>
                        Read More <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded">
              <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No articles found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded font-bold text-sm transition-colors ${
                    page === 1
                      ? `${c.bg} text-white`
                      : `bg-white text-slate-700 hover:${c.bgLight} border border-slate-200`
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className={`px-4 h-10 rounded font-bold text-sm bg-white text-slate-700 hover:${c.bgLight} border border-slate-200 transition-colors inline-flex items-center gap-1`}>
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-slate-300 mb-6">Get the latest logistics insights delivered to your inbox weekly.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thanks for subscribing!');
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 rounded text-slate-900 focus:outline-none focus:ring-2 ${c.ring} bg-white text-sm`}
            />
            <button
              type="submit"
              className={`${c.bg} ${c.bgHover} text-white text-sm font-bold px-6 py-3 rounded transition-colors`}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
