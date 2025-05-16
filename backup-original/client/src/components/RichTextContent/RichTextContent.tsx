import React, { useEffect, useRef, useState } from 'react';
import './RichTextContent.css';
import CodeRenderer from './CodeRenderer';

interface RichTextContentProps {
  content: string;
  className?: string;
}

const RichTextContent: React.FC<RichTextContentProps> = ({ 
  content, 
  className = '' 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [processedContent, setProcessedContent] = useState(content);
  const [codeBlocks, setCodeBlocks] = useState<{ id: string; code: string; language: string }[]>([]);

  // Process the content to extract code blocks and improve markup
  useEffect(() => {
    let tempContent = content;
    const extractedCodeBlocks: { id: string; code: string; language: string }[] = [];
    let codeBlockId = 0;
    
    // Replace HTML code blocks with placeholders
    tempContent = tempContent.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, (match, codeContent) => {
      // Detect if it's HTML code
      const isHtml = codeContent.includes('<!DOCTYPE') || 
                     codeContent.includes('<html') || 
                     codeContent.includes('<body') ||
                     (codeContent.includes('<') && codeContent.includes('</'));
                     
      const language = isHtml ? 'html' : 'other';
      const id = `code-block-${codeBlockId++}`;
      
      // Decode HTML entities
      const decodedContent = codeContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
        
      extractedCodeBlocks.push({
        id,
        code: decodedContent,
        language
      });
      
      return `<div id="${id}" class="code-block-placeholder"></div>`;
    });
    
    setProcessedContent(tempContent);
    setCodeBlocks(extractedCodeBlocks);
  }, [content]);

  // This effect runs after rendering to ensure proper styling and content processing
  useEffect(() => {
    if (contentRef.current) {
      // Replace code block placeholders with actual CodeRenderer components
      codeBlocks.forEach(block => {
        const placeholder = contentRef.current?.querySelector(`#${block.id}`);
        if (placeholder) {
          // Clear existing content
          placeholder.innerHTML = '';
          
          // Create container for code renderer
          const container = document.createElement('div');
          container.className = 'code-renderer';
          
          // Create code display
          const codeBlock = document.createElement('pre');
          const codeElement = document.createElement('code');
          codeElement.textContent = block.code;
          codeBlock.appendChild(codeElement);
          container.appendChild(codeBlock);
          
          // If HTML code, add preview section
          if (block.language === 'html') {
            // Add toggle button
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'preview-toggle';
            const toggleButton = document.createElement('button');
            toggleButton.className = 'preview-button active';
            toggleButton.textContent = 'Hide Preview';
            toggleButton.addEventListener('click', function(this: HTMLButtonElement, _: Event) {
              const previewArea = container.querySelector('.preview-area') as HTMLElement;
              if (previewArea) {
                const isVisible = previewArea.style.display !== 'none';
                previewArea.style.display = isVisible ? 'none' : 'block';
                this.textContent = isVisible ? 'Show Preview' : 'Hide Preview';
                this.classList.toggle('active');
              }
            } as EventListener);
            toggleDiv.appendChild(toggleButton);
            container.appendChild(toggleDiv);
            
            // Add preview area
            const previewArea = document.createElement('div');
            previewArea.className = 'preview-area';
            
            // Add preview header
            const previewHeader = document.createElement('div');
            previewHeader.className = 'preview-header';
            previewHeader.innerHTML = '<span>Preview</span>';
            previewArea.appendChild(previewHeader);
            
            // Add preview content with iframe
            const previewContent = document.createElement('div');
            previewContent.className = 'preview-content';
            
            const iframe = document.createElement('iframe');
            iframe.className = 'html-preview';
            iframe.setAttribute('sandbox', 'allow-same-origin');
            iframe.setAttribute('title', 'HTML Preview');
            iframe.srcdoc = block.code;
            
            previewContent.appendChild(iframe);
            previewArea.appendChild(previewContent);
            container.appendChild(previewArea);
          }
          
          placeholder.appendChild(container);
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
          const blockquoteContent = blockquote.innerHTML;
          blockquote.innerHTML = `<p>${blockquoteContent}</p>`;
        }
      });
      
      // Wrap all tables with a scrollable container
      const tables = contentRef.current.querySelectorAll('table');
      tables.forEach(table => {
        // Check if table is not already wrapped
        if (table.parentElement && !table.parentElement.classList.contains('table-container')) {
          // Create wrapper container
          const tableContainer = document.createElement('div');
          tableContainer.className = 'table-container';
          
          // Insert container before table in the DOM
          table.parentNode?.insertBefore(tableContainer, table);
          
          // Move table inside container
          tableContainer.appendChild(table);
        }
      });
    }
  }, [processedContent, codeBlocks]);

  return (
    <div 
      ref={contentRef}
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default RichTextContent;