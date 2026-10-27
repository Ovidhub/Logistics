import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Search, MessageCircle, CheckCircle2 } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

const blogPosts = [
  {
    id: 1,
    title: 'Air or ocean? A decision framework that survives a deadline',
    excerpt:
      'A practical way to choose between speed and cost — including the break-even weight where air freight quietly stops being the expensive answer.',
    author: 'Sarah Johnson',
    date: 'Oct 14, 2026',
    category: 'Guides',
    image: 'https://images.pexels.com/photos/32010721/pexels-photo-32010721.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 24,
  },
  {
    id: 2,
    title: 'The five customs documents that delay most first shipments',
    excerpt:
      'Miss one and your container waits at the terminal. Here is the checklist our brokers run before any export leaves the dock.',
    author: 'Michael Chen',
    date: 'Oct 2, 2026',
    category: 'Customs',
    image: 'https://images.pexels.com/photos/15346128/pexels-photo-15346128.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 18,
  },
  {
    id: 3,
    title: 'How to pack freight so it arrives the way it left',
    excerpt:
      'Pallet stacking, stretch-wrap tension and the three consignments our warehouse team sees damaged most often — with fixes that cost almost nothing.',
    author: 'Lisa Wang',
    date: 'Sep 18, 2026',
    category: 'Operations',
    image: 'https://images.pexels.com/photos/4487363/pexels-photo-4487363.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 27,
  },
  {
    id: 4,
    title: 'What real-time tracking should tell you — and what most portals hide',
    excerpt:
      'A status label is not visibility. The five data points worth demanding from any logistics partner before you sign the contract.',
    author: 'James Wilson',
    date: 'Sep 3, 2026',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/31310062/pexels-photo-31310062.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 21,
  },
  {
    id: 5,
    title: 'Cutting empty miles: how we plan a week of trucking',
    excerpt:
      'Backhaul matching, load pooling and the routing decisions that took 11% of deadhead mileage out of our network last year.',
    author: 'David Park',
    date: 'Aug 21, 2026',
    category: 'Sustainability',
    image: 'https://images.pexels.com/photos/24246926/pexels-photo-24246926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 32,
  },
  {
    id: 6,
    title: 'Warehouse slotting: the cheapest speed-up in your supply chain',
    excerpt:
      'Why the fastest pickers are beaten by the best layout — and how re-slotting your top 200 SKUs can cut pick time by a third.',
    author: 'Emily Rodriguez',
    date: 'Aug 6, 2026',
    category: 'Operations',
    image: 'https://images.pexels.com/photos/4487363/pexels-photo-4487363.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=800',
    comments: 15,
  },
];

const categories = ['All', 'Guides', 'Customs', 'Operations', 'Technology', 'Sustainability'];

export default function BlogPage() {
  const { settings } = useSettings();
  const c = colorClasses[settings.primaryColor as PrimaryColor] || colorClasses.red;
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      <PageBanner title="The Atrans journal" breadcrumb="Insights" />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Insights</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Practical notes from the loading dock
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Rate movements, customs changes and operating habits worth copying — written by the
              people who move the cargo, not a content agency.
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
                  placeholder="Search the journal…"
                  aria-label="Search articles"
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
                      loading="lazy"
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
                      <button className={`inline-flex items-center gap-2 ${c.text} hover:opacity-80 text-sm font-bold transition-opacity`}>
                        Read the article <ArrowRight className="w-4 h-4" />
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
              <p className="text-slate-600 font-semibold">Nothing matches that search yet.</p>
              <p className="text-sm text-slate-500 mt-1">Try a broader term, or clear the category filter.</p>
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  aria-label={`Page ${page}`}
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
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">One useful email a month</h2>
          <p className="text-slate-300 mb-6">
            Lane updates, rate movements and the occasional checklist. No sales blasts — unsubscribe in one click.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-sm font-semibold px-5 py-3 rounded">
              <CheckCircle2 className="w-4 h-4" /> You’re on the list. Look out for the next dispatch.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email address"
                className={`flex-1 px-4 py-3 rounded text-slate-900 focus:outline-none focus:ring-2 ${c.ring} bg-white text-sm`}
              />
              <button
                type="submit"
                className={`${c.bg} ${c.bgHover} text-white text-sm font-bold px-6 py-3 rounded transition-colors`}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
