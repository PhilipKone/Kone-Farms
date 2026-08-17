import React, { useState, useEffect, useMemo } from 'react';
import { blogArticles } from '../data/blogArticles';
import './BlogPost.css';

export default function BlogPost({ slug, onBack, onSelectArticle }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMathIdx, setCopiedMathIdx] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [katexLoaded, setKatexLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const article = useMemo(() => {
    return blogArticles.find(a => a.slug === slug) || blogArticles[0];
  }, [slug]);

  // Track window scroll for progress bar, active section, and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowBackToTop(window.scrollY > 400);

      // Section scroll-spy
      const headings = Array.from(document.querySelectorAll('.post-section-heading'));
      for (let i = headings.length - 1; i >= 0; i--) {
        const h = headings[i];
        const rect = h.getBoundingClientRect();
        if (rect.top <= 140) {
          setActiveSectionId(h.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  // Load KaTeX dynamically if missing
  useEffect(() => {
    if (window.katex) {
      setKatexLoaded(true);
    } else {
      const interval = setInterval(() => {
        if (window.katex) {
          setKatexLoaded(true);
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  // Extract Table of Contents (TOC) headings from content
  const tocItems = useMemo(() => {
    if (!article || !article.content) return [];
    const lines = article.content.split(/\r?\n\r?\n/);
    const items = [];

    lines.forEach((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.replace(/^###\s+/, '').replace(/\*|\$/g, '').trim();
        const safeId = `sec-${idx}-${titleText.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}`;
        items.push({ id: safeId, text: titleText, blockIdx: idx });
      }
    });

    return items;
  }, [article]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSectionId(id);
      setShowMobileToc(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyFirmwareCode = () => {
    if (article.codeSnippet) {
      navigator.clipboard.writeText(article.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const copyArticleLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyMathFormula = (formulaText, idx) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedMathIdx(idx);
    setTimeout(() => setCopiedMathIdx(null), 2500);
  };

  const scrollToRef = (refId) => {
    const el = document.getElementById(`ref-${refId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-ref');
      setTimeout(() => el.classList.remove('highlight-ref'), 2200);
    }
  };

  // Render KaTeX Math equations
  const renderMath = (texString, displayMode = false) => {
    if (window.katex) {
      try {
        const htmlStr = window.katex.renderToString(texString, {
          displayMode: displayMode,
          throwOnError: false
        });
        return <span dangerouslySetInnerHTML={{ __html: htmlStr }} />;
      } catch (err) {
        console.warn("KaTeX render error:", err);
      }
    }
    return <code className="fallback-tex">{texString}</code>;
  };

  // Enhanced Formatted Text Parser supporting LaTeX math ($...$), Bold (**...**), Italics (*...*), and Citations ([1])
  const renderFormattedText = (text) => {
    const regex = /(\$.*?\$|\*\*.*?\*\*|\*[^\*]+?\*|\[\d+\])/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      // Inline LaTeX Math ($...$)
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const mathExpr = part.slice(1, -1);
        return <span key={i} className="inline-math-wrapper">{renderMath(mathExpr, false)}</span>;
      }
      
      // Bold text (**...**)
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} className="text-emerald-bold">{part.slice(2, -2)}</strong>;
      }
      
      // Italics scientific species names (*...*)
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i} className="text-scientific-italic">{part.slice(1, -1)}</em>;
      }
      
      // Superscript citation link ([1])
      if (/^\[\d+\]$/.test(part)) {
        const num = part.replace(/[\[\]]/g, '');
        return (
          <sup key={i}>
            <a 
              href={`#ref-${num}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToRef(num);
              }}
              className="intext-citation-link"
              title={`Jump to Reference [${num}]`}
            >
              [{num}]
            </a>
          </sup>
        );
      }

      return part;
    });
  };

  // Parse Markdown Tables (| col | col |) into responsive HTML tables
  const renderMarkdownTable = (tableBlockStr, key) => {
    const lines = tableBlockStr.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return null;

    const parseRow = (lineStr) => {
      return lineStr
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim());
    };

    const headerCells = parseRow(lines[0]);
    const bodyLines = lines.slice(1).filter(l => !l.includes('---'));

    return (
      <div key={key} className="table-responsive-wrapper">
        <table className="post-markdown-table">
          <thead>
            <tr>
              {headerCells.map((cell, cIdx) => (
                <th key={cIdx}>{renderFormattedText(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyLines.map((bLine, rIdx) => {
              const rowCells = parseRow(bLine);
              return (
                <tr key={rIdx}>
                  {rowCells.map((cell, cIdx) => (
                    <td key={cIdx}>{renderFormattedText(cell)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const relatedArticles = useMemo(() => {
    return blogArticles.filter(a => a.slug !== article.slug).slice(0, 2);
  }, [article]);

  return (
    <div className="farms-post-container" itemScope itemType="https://schema.org/TechArticle">
      {/* Top Scroll Reading Progress Bar */}
      <div 
        className="reading-progress-bar" 
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Navigation Header */}
      <div className="post-nav-bar">
        <a 
          href="#blog" 
          onClick={(e) => { e.preventDefault(); window.location.hash = '#blog'; if (onBack) onBack(); }}
          className="post-back-btn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Agritech Research Hub
        </a>

        {/* Share Quick Action Buttons */}
        <div className="share-actions-row">
          <button className="share-btn" onClick={copyArticleLink} title="Copy Article Link">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.2" fill="none" style={{ marginRight: '5px' }}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {copiedLink ? 'Link Copied!' : 'Share Link'}
          </button>
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - Read at ${window.location.href}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn whatsapp-share"
            title="Share via WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: '5px' }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Main Header Banner */}
      <header className="post-header-banner" style={{ background: article.coverGradient }}>
        <div className="post-category-tag">{article.category}</div>
        <h1 className="post-main-title" itemProp="headline">{renderFormattedText(article.title)}</h1>
        <p className="post-main-summary" itemProp="description">{renderFormattedText(article.summary)}</p>

        <div className="post-author-bar">
          <a 
            href={article.author.profileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="post-author-link"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
            title={`View ${article.author.name}'s bio`}
          >
            <div className="post-author-avatar-badge">
              {article.author.name.charAt(0)}
            </div>
            <div className="post-author-meta">
              <span className="post-author-name" itemProp="name">{article.author.name}</span>
              <span className="post-author-role" itemProp="jobTitle">{article.author.role}</span>
            </div>
          </a>

          <div className="post-time-meta">
            <span className="meta-item">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '4px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <time itemProp="datePublished" dateTime={article.isoDate}>{article.publishDate}</time>
            </span>
            <span className="meta-item">
              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '4px' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {article.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Collapsible Table of Contents (TOC) */}
      {tocItems.length > 0 && (
        <div className="mobile-toc-bar">
          <button 
            className="mobile-toc-trigger"
            onClick={() => setShowMobileToc(!showMobileToc)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Table of Contents ({tocItems.length} Sections)
            </span>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ transform: showMobileToc ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {showMobileToc && (
            <nav className="mobile-toc-dropdown">
              <ul>
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`}
                      className={activeSectionId === item.id ? 'active' : ''}
                      onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* Article Content Area with Desktop Sidebar Layout */}
      <div className="article-layout-grid">
        {/* Article Body */}
        <article className="post-body-content" itemProp="articleBody">
          <div className="post-text-blocks">
            {article.content.split(/\r?\n\r?\n/).map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed === '---') {
                return <hr key={idx} className="post-divider-line" />;
              } else if (trimmed.startsWith('MATH_BLOCK:')) {
                const formula = trimmed.replace('MATH_BLOCK:', '').trim();
                return (
                  <div key={idx} className="post-math-card">
                    <div className="math-card-header">
                      <span className="math-label">LaTeX Mathematical Model (Eq. {idx})</span>
                      <button 
                        className="copy-math-btn" 
                        onClick={() => copyMathFormula(formula, idx)}
                        title="Copy LaTeX Formula"
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '4px' }}>
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        {copiedMathIdx === idx ? 'Copied!' : 'Copy LaTeX'}
                      </button>
                    </div>
                    <div className="math-formula-container">
                      {renderMath(formula, true)}
                    </div>
                  </div>
                );
              } else if (trimmed.startsWith('|')) {
                return renderMarkdownTable(trimmed, idx);
              } else if (trimmed.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="agritech-callout-card">
                    <div className="callout-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="#f59e0b" strokeWidth="2" fill="none">
                        <line x1="9" y1="18" x2="15" y2="18"></line>
                        <line x1="10" y1="22" x2="14" y2="22"></line>
                        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                      </svg>
                    </div>
                    <div className="callout-content">
                      {renderFormattedText(trimmed.replace(/^>\s*/, ''))}
                    </div>
                  </blockquote>
                );
              } else if (trimmed.startsWith('### ')) {
                const titleText = trimmed.replace(/^###\s+/, '').trim();
                const safeId = `sec-${idx}-${titleText.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}`;
                return (
                  <h3 key={idx} id={safeId} className="post-subhead-h3 post-section-heading">
                    {renderFormattedText(titleText)}
                  </h3>
                );
              } else if (trimmed.startsWith('#### ')) {
                return <h4 key={idx} className="post-subhead-h4">{renderFormattedText(trimmed.replace(/^####\s+/, ''))}</h4>;
              } else if (/^\d+\.\s/.test(trimmed)) {
                return (
                  <ol key={idx} className="post-numbered-list">
                    {trimmed.split(/\r?\n/).map((item, itemIdx) => (
                      <li key={itemIdx}>{renderFormattedText(item.replace(/^\d+\.\s*/, ''))}</li>
                    ))}
                  </ol>
                );
              } else if (trimmed.startsWith('- ')) {
                return (
                  <ul key={idx} className="post-bullet-list">
                    {trimmed.split(/\r?\n/).map((item, itemIdx) => (
                      <li key={itemIdx}>{renderFormattedText(item.replace(/^- \s*/, ''))}</li>
                    ))}
                  </ul>
                );
              } else if (trimmed.length > 0) {
                return <p key={idx} className="post-paragraph">{renderFormattedText(trimmed)}</p>;
              }
              return null;
            })}
          </div>

          {/* Hardware Bill of Materials (BOM) Table */}
          {article.hardwareBOM && article.hardwareBOM.length > 0 && (
            <section className="hardware-bom-section">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                Hardware Bill of Materials (BOM) & Microcontroller Schematics
              </h3>
              <div className="table-responsive-wrapper">
                <table className="bom-table">
                  <thead>
                    <tr>
                      <th>Hardware Component</th>
                      <th>Technical Specification & Protocol</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {article.hardwareBOM.map((bom, idx) => (
                      <tr key={idx}>
                        <td className="bom-component-name">{bom.component}</td>
                        <td className="bom-spec">{bom.spec}</td>
                        <td className="bom-qty">{bom.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Collapsible Firmware Code Snippet */}
          {article.codeSnippet && (
            <section className="code-snippet-section">
              <button 
                className="code-toggle-btn"
                onClick={() => setShowCode(!showCode)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  {showCode ? 'Hide Microcontroller Firmware Code' : 'Expand Microcontroller Firmware Code (C++)'}
                </span>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ transform: showCode ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showCode && (
                <div className="code-display-wrapper">
                  <div className="code-header-bar">
                    <span className="code-lang-label">ESP32 / Arduino C++ Telemetry Code</span>
                    <button className="copy-code-btn" onClick={copyFirmwareCode}>
                      <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '4px' }}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      {copiedCode ? 'Copied to Clipboard!' : 'Copy Firmware Code'}
                    </button>
                  </div>
                  <pre className="code-block-display">
                    <code>{article.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </section>
          )}

          {/* Formal References & Peer-Reviewed Scientific Sources Section */}
          {article.references && article.references.length > 0 && (
            <section className="scientific-references-section">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Scientific References & Peer-Reviewed Datasheets
              </h3>
              <ul className="references-list">
                {article.references.map((ref) => (
                  <li key={ref.id} id={`ref-${ref.id}`} className="reference-item">
                    <span className="ref-index">[{ref.id}]</span>
                    <div className="ref-details">
                      <a 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ref-title-link"
                      >
                        {ref.title}
                      </a>
                      <span className="ref-publisher-badge">{ref.publisher}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Author Bio Card */}
          <section className="author-bio-card">
            <div className="author-bio-avatar">
              {article.author.name.charAt(0)}
            </div>
            <div className="author-bio-info">
              <h4>{article.author.name}</h4>
              <p className="bio-role">{article.author.role}</p>
              <p className="bio-desc">
                Leading IoT agritech telemetry deployments, soil bio-kinetics research, and hardware microcontroller engineering across West Africa.
              </p>
              <a href={article.author.profileUrl} target="_blank" rel="noopener noreferrer" className="author-profile-link">
                View Full Research Profile →
              </a>
            </div>
          </section>

          {/* Related Articles Navigation */}
          {relatedArticles.length > 0 && (
            <section className="related-articles-section">
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#34d399" strokeWidth="2" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Related Agritech Research Studies
              </h3>
              <div className="related-grid">
                {relatedArticles.map(rel => (
                  <article key={rel.id} className="related-card" onClick={() => { window.location.hash = `#blog/${encodeURIComponent(rel.slug)}`; if (onSelectArticle) onSelectArticle(rel.slug); }}>
                    <span className="rel-cat-badge">{rel.category}</span>
                    <h4 className="rel-title">{rel.title}</h4>
                    <span className="rel-read-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {rel.readTime}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Bottom Back Button */}
          <div className="post-footer-bar">
            <a 
              href="#blog" 
              onClick={(e) => { e.preventDefault(); window.location.hash = '#blog'; if (onBack) onBack(); }}
              className="post-back-btn-large"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginRight: '6px' }}>
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Agritech Research Hub
            </a>
          </div>
        </article>

        {/* Desktop Sticky Table of Contents (TOC Sidebar) */}
        {tocItems.length > 0 && (
          <aside className="desktop-toc-sidebar">
            <div className="sticky-toc-box">
              <h4 className="toc-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                Table of Contents
              </h4>
              <nav className="toc-nav">
                <ul>
                  {tocItems.map(item => (
                    <li key={item.id}>
                      <a 
                        href={`#${item.id}`}
                        className={activeSectionId === item.id ? 'active' : ''}
                        onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to Top">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}
