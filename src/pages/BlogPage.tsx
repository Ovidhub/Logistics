import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Search, MessageCircle, CheckCircle2 } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useSettings } from '../hooks/useSettings';
import { colorClasses, type PrimaryColor } from '../utils/colors';

const blogPosts = [
  {
    id: 1,
    title: 'Peak season without the panic: booking capacity in September',
    excerpt:
      'Why the cheapest rate in October is booked in July — and the three questions worth asking your forwarder before the rush starts.',
    author: 'Adaeze Nwosu',
    date: 'Oct 20, 2026',
    category: 'Operations',
    image: '/images/ocean-freight-800.jpg',
    comments: 19,
  },
  {
    id: 2,
    title: 'What a landed-cost quote should itemise',
    excerpt:
      'Freight is the easy number. Here is the rest of the invoice — duty, terminal handling, bonds, demurrage risk — and how to sanity-check it.',
    author: 'Daniel Okafor',
    date: 'Oct 8, 2026',
    category: 'Guides',
    image: '/images/warehouse-800.jpg',
    comments: 31,
  },
  {
    id: 3,
    title: 'Incoterms in plain English: who pays when the crane moves',
    excerpt:
      'FOB, CIF, DAP and the gap between them, explained by what actually happens on the quay rather than by acronym.',
    author: 'Grace Mensah',
    date: 'Sep 26, 2026',
    category: 'Customs',
    image: '/images/berth-800.jpg',
    comments: 44,
  },
  {
    id: 4,
    title: 'Why your container gets held — and the three documents that fix it',
    excerpt:
      'Most holds are paperwork, not smuggling. The commercial invoice, packing list and certificate details that clear 80% of them.',
    author: 'Tunde Bakare',
    date: 'Sep 11, 2026',
    category: 'Customs',
    image: '/images/air-freight-800.jpg',
    comments: 26,
  },
  {
    id: 5,
    title: 'Backhauls: how we cut empty running by 11% in a year',
    excerpt:
      'Matching return loads, pooling part shipments and the routing decisions that took deadhead miles off our network.',
    author: 'Ifeoma Eze',
    date: 'Aug 29, 2026',
    category: 'Sustainability',
    image: '/images/road-freight-800.jpg',
    comments: 12,
  },
  {
    id: 6,
    title: 'From scan to screen: how our tracking actually works',
    excerpt:
      'What happens between a barcode beep at the depot and the status change on your phone — including where tracking normally breaks.',
    author: 'Samuel Adeyemi',
    date: 'Aug 14, 2026',
    category: 'Technology',
    image: '/images/hero-port-800.jpg',
    comments: 23,
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
      <PageBanner title="Journal" breadcrumb="Journal" />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className={`${c.text} font-bold text-sm uppercase tracking-wider mb-3`}>Field notes</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Notes from the quay, the depot and the desk
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Trade lane movement, customs practice and operating habits our coordinators actually use —
              written by the people doing the work.
            </p>
          </div>

          {/* Filter */}
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

          {/* Posts */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
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
                        Read on <ArrowRight className="w-4 h-4" />
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
              <p className="text-slate-600 font-semibold">No articles match that search.</p>
              <p className="text-sm text-slate-500 mt-1">Try a different term, or clear the category filter.</p>
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

      {/* Newsletter */}
      <section className="py-16 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">The monthly despatch</h2>
          <p className="text-slate-300 mb-6">
            One email a month: rate movement, customs changes and a checklist you can use. No sales
            sequences, unsubscribe in one click.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-sm font-semibold px-5 py-3 rounded">
              <CheckCircle2 className="w-4 h-4" /> Subscribed. The next despatch lands on the first Monday.
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
