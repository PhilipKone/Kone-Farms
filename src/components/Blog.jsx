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

  return (
    <div className="farms-blog-container">
      <div className="farms-blog-hero">
        <div className="farms-blog-badge">
          <span className="badge-pulse"></span>
          KONE FARMS AGRITECH RESEARCH & ENGINEERING
        </div>
        <h1 className="farms-blog-title">
          Smart Agriculture & <span className="text-emerald-glow">Precision Telemetry</span>
        </h1>
        <p className="farms-blog-subtitle">
          Deep-dive engineering research, hardware circuit schematics, sensor calibration algorithms, 
          and field-tested IoT deployments across Ghana and West Africa.
        </p>

        {/* Search & Category Filter */}
        <div className="farms-blog-controls">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search articles by topic, sensor, or frequency..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-text-input"
            />
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
        </div>
      </div>

      {/* Articles Grid */}
      <div className="farms-blog-grid">
        {filteredArticles.length === 0 ? (
          <div className="no-articles-found">
            <p>No agricultural engineering articles found matching "{searchQuery.replace(/[^a-zA-Z0-9\s-_]/g, '')}".</p>
            <button className="reset-search-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredArticles.map(art => (
            <article key={art.id} className="blog-card-item">
              <div className="blog-card-header" style={{ background: art.coverGradient }}>
                <div className="card-top-meta">
                  <span className="card-category-badge">{art.category}</span>
                  <span className="card-read-time">{art.readTime}</span>
                </div>
                <h2 className="card-article-title">{art.title}</h2>
              </div>

              <div className="blog-card-body">
                <p className="card-summary">{art.summary}</p>
                
                <div className="card-tags-row">
                  {art.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag-pill">#{tag}</span>
                  ))}
                </div>

                <div className="card-footer">
                  <a 
                    href={art.author.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="author-info-link"
                    title={`View ${art.author.name}'s bio`}
                  >
                    <img src={art.author.avatar} alt={art.author.name} className="author-avatar-img" />
                    <div className="author-text-meta">
                      <span className="author-name">{art.author.name}</span>
                      <span className="article-pub-date">{art.publishDate}</span>
                    </div>
                  </a>

                  <a 
                    href={`#blog/${art.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = `#blog/${art.slug}`;
                      if (onSelectArticle) onSelectArticle(art.slug);
                    }}
                    className="read-article-btn"
                  >
                    Read Deep-Dive
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: '4px' }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
