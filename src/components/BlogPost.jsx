import React, { useState, useEffect } from 'react';
import { blogArticles } from '../data/blogArticles';
import './BlogPost.css';

export default function BlogPost({ slug, onBack }) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [katexLoaded, setKatexLoaded] = useState(false);

  const article = blogArticles.find(a => a.slug === slug) || blogArticles[0];

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

  const copyCode = () => {
    if (article.codeSnippet) {
      navigator.clipboard.writeText(article.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToRef = (refId) => {
    const el = document.getElementById(`ref-${refId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-ref');
      setTimeout(() => el.classList.remove('highlight-ref'), 2000);
    }
  };

  // Helper to render KaTeX Math equations
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
    // Tokenize text into math ($...$), bold (**...**), italics (*...*), and citations ([1])
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

  return (
    <div className="farms-post-container" itemScope itemType="https://schema.org/TechArticle">
      {/* Top Navigation */}
      <div className="post-nav-bar">
        <a 
          href="#blog" 
          onClick={(e) => { e.preventDefault(); window.location.hash = '#blog'; if (onBack) onBack(); }}
          className="post-back-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Agritech Research Hub
        </a>
      </div>

      {/* Header Banner */}
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
            <img src={article.author.avatar} alt={article.author.name} className="post-author-img" itemProp="image" />
            <div className="post-author-meta">
              <span className="post-author-name" itemProp="name">{article.author.name}</span>
              <span className="post-author-role" itemProp="jobTitle">{article.author.role}</span>
            </div>
          </a>

          <div className="post-time-meta">
            <span className="meta-item">📅 <time itemProp="datePublished" dateTime={article.isoDate}>{article.publishDate}</time></span>
            <span className="meta-item">⏱️ {article.readTime}</span>
          </div>
        </div>
      </header>

      {/* Article Content Body */}
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
                  <span className="math-label">LaTeX Mathematical Model:</span>
                  <div className="math-formula-container">
                    {renderMath(formula, true)}
                  </div>
                </div>
              );
            } else if (trimmed.startsWith('### ')) {
              return <h3 key={idx} className="post-subhead-h3">{renderFormattedText(trimmed.replace(/^###\s+/, ''))}</h3>;
            } else if (trimmed.startsWith('#### ')) {
              return <h4 key={idx} className="post-subhead-h4">{renderFormattedText(trimmed.replace(/^####\s+/, ''))}</h4>;
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
            <h3 className="section-title">🔧 Hardware Bill of Materials (BOM)</h3>
            <div className="table-responsive-wrapper">
              <table className="bom-table">
                <thead>
                  <tr>
                    <th>Component Name</th>
                    <th>Technical Specification</th>
                    <th>Quantity / Node</th>
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
              <span>{showCode ? '📖 Hide Microcontroller Firmware Code' : '💻 Expand Microcontroller Firmware Code (C++)'}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ transform: showCode ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {showCode && (
              <div className="code-display-wrapper">
                <div className="code-header-bar">
                  <span className="code-lang-label">Arduino C++ Telemetry Code</span>
                  <button className="copy-code-btn" onClick={copyCode}>
                    {copied ? '✅ Copied to Clipboard!' : '📋 Copy Firmware Code'}
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
            <h3 className="section-title">📚 Scientific References & Hardware Datasheets</h3>
            <ul className="references-list">
              {article.references.map((ref) => (
                <li key={ref.id} id={`ref-${ref.id}`} className="reference-item">
                  <span className="ref-number">[{ref.id}]</span>
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
      </article>
    </div>
  );
}
