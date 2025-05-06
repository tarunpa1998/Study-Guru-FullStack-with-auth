import React, { useEffect, useRef } from 'react';
import './RichTextContent.css';

interface RichTextContentProps {
  content: string;
  className?: string;
}

const RichTextContent: React.FC<RichTextContentProps> = ({ 
  content, 
  className = '' 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // This effect runs after rendering to ensure proper styling of pre and code blocks
  useEffect(() => {
    if (contentRef.current) {
      // Ensure all code blocks are properly formatted
      const preElements = contentRef.current.querySelectorAll('pre');
      preElements.forEach(pre => {
        // Make sure pre has a code child
        if (!pre.querySelector('code')) {
          const code = document.createElement('code');
          code.innerHTML = pre.innerHTML;
          pre.innerHTML = '';
          pre.appendChild(code);
        }
      });

      // Add syntax highlighting classes to inline code elements
      const codeElements = contentRef.current.querySelectorAll('code:not(pre code)');
      codeElements.forEach(code => {
        code.classList.add('inline-code');
      });

      // Process blockquotes to ensure they have paragraph elements
      const blockquotes = contentRef.current.querySelectorAll('blockquote');
      blockquotes.forEach(blockquote => {
        // If blockquote doesn't contain paragraphs, wrap content in a paragraph
        if (!blockquote.querySelector('p')) {
          const content = blockquote.innerHTML;
          blockquote.innerHTML = `<p>${content}</p>`;
        }
      });
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextContent;