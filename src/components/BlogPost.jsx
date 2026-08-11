import React, { useState } from 'react';
import { blogArticles } from '../data/blogArticles';
import './BlogPost.css';

export default function BlogPost({ slug, onBack }) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false); // Collapsible code toggle

  const article = blogArticles.find(a => a.slug === slug) || blogArticles[0];

  const copyCode = () => {
    if (article.codeSnippet) {
      navigator.clipboard.writeText(article.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Helper to parse basic markdown bold/text formatting cleanly
  const renderFormattedText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-emerald-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="farms-post-container">
      {/* Top Navigation */}
      <div className="post-nav-bar">
        <a 
          href="#blog" 
          onClick={(e) => { e.preventDefault(); window.location.hash = '#blog'; if (onBack) onBack(); }}
          className="post-back-btn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 19"></polyline>
          </svg>
          Back to Agritech Research Hub
        </a>
      </div>

      {/* Header Banner */}
      <header className="post-header-banner" style={{ background: article.coverGradient }}>
        <div className="post-category-tag">{article.category}</div>
        <h1 className="post-main-title">{article.title}</h1>
        <p className="post-main-summary">{article.summary}</p>

        <div className="post-author-bar">
          <a 
            href={article.author.profileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="post-author-link"
            title={`View ${article.author.name}'s bio`}
          >
            <img src={article.author.avatar} alt={article.author.name} className="post-author-img" />
            <div className="post-author-meta">
              <span className="post-author-name">{article.author.name}</span>
              <span className="post-author-role">{article.author.role}</span>
            </div>
          </a>

          <div className="post-time-meta">
            <span className="meta-item">📅 {article.publishDate}</span>
            <span className="meta-item">⏱️ {article.readTime}</span>
          </div>
        </div>
      </header>

      {/* Article Content Body */}
      <article className="post-body-content">
        <div className="post-text-blocks">
          {article.content.split('\n\n').map((block, idx) => {
            const trimmed = block.trim();
            if (trimmed === '---') {
              return <hr key={idx} className="post-divider-line" />;
            } else if (trimmed.startsWith('### ')) {
              return <h3 key={idx} className="post-subhead-h3">{trimmed.replace('### ', '')}</h3>;
            } else if (trimmed.startsWith('#### ')) {
              return <h4 key={idx} className="post-subhead-h4">{trimmed.replace('#### ', '')}</h4>;
            } else if (trimmed.startsWith('- ')) {
              return (
                <ul key={idx} className="post-bullet-list">
                  {trimmed.split('\n').map((item, itemIdx) => (
                    <li key={itemIdx}>{renderFormattedText(item.replace('- ', ''))}</li>
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
              {article.references.map((ref, idx) => (
                <li key={idx} className="reference-item">
                  <span className="ref-index">[{idx + 1}]</span>
                  <div className="ref-details">
                    <a 
                      href={ref.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="ref-external-link"
                    >
                      {ref.title}
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" style={{ marginLeft: '4px' }}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                    <span className="ref-publisher">{ref.publisher}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Footer Navigation */}
      <div className="post-footer-bar">
        <a 
          href="#blog" 
          onClick={(e) => { e.preventDefault(); window.location.hash = '#blog'; if (onBack) onBack(); }}
          className="post-back-btn-large"
        >
          ← Return to Agritech Research Hub
        </a>
      </div>
    </div>
  );
}
