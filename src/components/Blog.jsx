import React, { useState, useMemo } from 'react';
import { blogArticles } from '../data/blogArticles';
import './Blog.css';

export default function Blog({ onSelectArticle }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const rawVal = e.target.value || '';
    const safeVal = rawVal.replace(/[^a-zA-Z0-9\s\-_]/g, '').slice(0, 50);
    setSearchQuery(safeVal);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const categories = ['All', 'Telemetry & IoT', 'Greenhouse Automation', 'Livestock & Poultry'];

  const filteredArticles = useMemo(() => {
    const cleanQuery = searchQuery.toLowerCase().trim();
    if (!cleanQuery && selectedCategory === 'All') return blogArticles;

    return blogArticles.filter(art => {
      const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
      if (!cleanQuery) return matchesCat;

      const matchesSearch = 
        art.title.toLowerCase().includes(cleanQuery) ||
        art.summary.toLowerCase().includes(cleanQuery) ||
        art.tags.some(tag => tag.toLowerCase().includes(cleanQuery));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim();
  const featuredArticle = isDefaultView ? filteredArticles[0] : null;
  const gridArticles = isDefaultView ? filteredArticles.slice(1) : filteredArticles;

  const navigateToArticle = (slug) => {
    window.location.hash = `#blog/${encodeURIComponent(slug)}`;
    if (onSelectArticle) onSelectArticle(slug);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Telemetry & IoT':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.2" fill="none" style={{ marginRight: '4px' }}>
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
          </svg>
        );
      case 'Greenhouse Automation':
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.2" fill="none" style={{ marginRight: '4px' }}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.2" fill="none" style={{ marginRight: '4px' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        );
    }
  };

  return (
    <div className="farms-blog-container">
      {/* Blog Hero Banner */}
      <div className="farms-blog-hero">
        <div className="farms-blog-badge">
          <span className="badge-pulse"></span>
          KONE FARMS AGRITECH RESEARCH & ENGINEERING HUB
        </div>
        <h1 className="farms-blog-title">
          Smart Agriculture & <span className="text-emerald-glow">Precision Telemetry</span>
        </h1>
        <p className="farms-blog-subtitle">
          Publication-grade agricultural research, edge AI disease prediction models, hardware circuit schematics, 
          and field-tested IoT telemetry deployments across Ghana and West Africa.
        </p>

        {/* Search & Category Filter Controls */}
        <div className="farms-blog-controls">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search articles by crop, sensor, LoRa mesh, or disease model..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="blog-search-input"
              aria-label="Search agritech articles"
            />
            {searchQuery && (
              <button 
                className="search-clear-btn" 
                onClick={handleClearSearch}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>

          <div className="category-pill-row">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="results-count-bar">
            <span>
              Showing <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? 'publication' : 'publications'}
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Lead Research Article (2-Column Hero Card) */}
      {featuredArticle && (
        <section className="featured-article-wrapper">
          <article className="featured-blog-card">
            <div className="featured-card-cover" style={{ background: featuredArticle.coverGradient }}>
              <div className="featured-badge-pill">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ marginRight: '4px' }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                FEATURED RESEARCH PAPER
              </div>

              <div className="featured-cover-visual">
                <div className="telemetry-node-graphic">
                  <div className="node-center-core">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <span className="node-pulse-ring"></span>
                  </div>
                  <div className="node-spec-tags">
                    <span className="spec-tag-item">LoRa SX1262 Mesh</span>
                    <span className="spec-tag-item">RS485 NPK Telemetry</span>
                    <span className="spec-tag-item">Sigatoka AI Bio-Model</span>
                  </div>
                </div>
              </div>

              <div className="featured-cover-graphic">
                <svg viewBox="0 0 100 100" width="140" height="140" opacity="0.15" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="50" cy="50" r="45" />
                  <path d="M50 5 L50 95 M5 50 L95 50 M20 20 L80 80 M20 80 L80 20" />
                </svg>
              </div>
            </div>

            <div className="featured-card-content">
              <div className="featured-meta-row">
                <span className="card-category-badge">{featuredArticle.category}</span>
                <span className="card-read-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {featuredArticle.readTime}
                </span>
              </div>

              <h2 className="featured-card-title">
                <a href={`#blog/${encodeURIComponent(featuredArticle.slug)}`} onClick={(e) => { e.preventDefault(); navigateToArticle(featuredArticle.slug); }}>
                  {featuredArticle.title}
                </a>
              </h2>

              <p className="featured-card-summary">{featuredArticle.summary}</p>

              <div className="card-tags-row">
                {featuredArticle.tags.map(tag => (
                  <span key={tag} className="tag-pill">#{tag}</span>
                ))}
              </div>

              <div className="featured-card-footer">
                <div className="author-info-block">
                  <div className="author-avatar-img">
                    {featuredArticle.author.name.charAt(0)}
                  </div>
                  <div className="author-text-meta">
                    <span className="author-name">{featuredArticle.author.name}</span>
                    <span className="author-role">{featuredArticle.author.role}</span>
                    <span className="article-pub-date">Published {featuredArticle.publishDate}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigateToArticle(featuredArticle.slug)}
                  className="read-featured-btn"
                  aria-label={`Read featured paper on ${featuredArticle.title}`}
                >
                  Explore Paper & Code
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: '6px' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Grid of Articles */}
      <div className="farms-blog-grid">
        {filteredArticles.length === 0 ? (
          <div className="no-articles-found">
            <div className="no-results-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="#64748b" strokeWidth="1.5" fill="none">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>No Agritech Publications Found</h3>
            <p>No research studies match your current query "{searchQuery}". Try adjusting your keywords or category filter.</p>
            <button className="reset-search-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset All Filters
            </button>
          </div>
        ) : (
          gridArticles.map(art => (
            <article key={art.id} className="blog-card-item">
              <div className="blog-card-header" style={{ background: art.coverGradient }}>
                <div className="card-top-meta">
                  <span className="card-category-badge">
                    {getCategoryIcon(art.category)}
                    {art.category}
                  </span>
                  <span className="card-read-time">{art.readTime}</span>
                </div>
                <h2 className="card-article-title">
                  <a href={`#blog/${encodeURIComponent(art.slug)}`} onClick={(e) => { e.preventDefault(); navigateToArticle(art.slug); }}>
                    {art.title}
                  </a>
                </h2>
              </div>

              <div className="blog-card-body">
                <p className="card-summary">{art.summary}</p>
                
                <div className="card-tags-row">
                  {art.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag-pill">#{tag}</span>
                  ))}
                </div>

                <div className="card-footer">
                  <div className="author-info-link">
                    <div className="author-avatar-img">
                      {art.author.name.charAt(0)}
                    </div>
                    <div className="author-text-meta">
                      <span className="author-name">{art.author.name}</span>
                      <span className="article-pub-date">{art.publishDate}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigateToArticle(art.slug)}
                    className="read-article-btn"
                    aria-label={`Read deep-dive on ${art.title}`}
                  >
                    Read Paper
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: '4px' }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
