import React, { useState, useEffect } from 'react';

interface CodeRendererProps {
  code: string;
  language?: string;
}

const CodeRenderer: React.FC<CodeRendererProps> = ({ code, language = 'html' }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [sanitizedCode, setSanitizedCode] = useState('');

  useEffect(() => {
    if (language === 'html') {
      // Replace any script tags to prevent XSS
      const sanitized = code
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- Scripts not allowed -->')
        .trim();
      setSanitizedCode(sanitized);
    }
  }, [code, language]);

  const shouldRenderPreview = language === 'html' && sanitizedCode;

  return (
    <div className="code-renderer">
      {/* Code display */}
      <div className="code-block">
        <pre>
          <code>{code}</code>
        </pre>
      </div>

      {/* Preview toggle */}
      {shouldRenderPreview && (
        <div className="preview-toggle">
          <button 
            className={`preview-button ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      )}

      {/* Preview area */}
      {shouldRenderPreview && showPreview && (
        <div className="preview-area">
          <div className="preview-header">
            <span>Preview</span>
          </div>
          <div className="preview-content">
            <iframe
              title="HTML Preview"
              className="html-preview"
              sandbox="allow-same-origin"
              srcDoc={sanitizedCode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeRenderer;