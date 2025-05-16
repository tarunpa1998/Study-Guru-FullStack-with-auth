import React, { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Heading from '@tiptap/extension-heading'
import Strike from '@tiptap/extension-strike'
import CodeBlock from '@tiptap/extension-code-block'
import Blockquote from '@tiptap/extension-blockquote'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import MarkdownIt from 'markdown-it'
import './RichTextEditor.css'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const mdParser = new MarkdownIt()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'rich-text-link',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Strike,
      CodeBlock,
      Blockquote,
      TextStyle,
      Color,
      ListItem,
      BulletList,
      OrderedList,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
        'data-placeholder': placeholder,
      },
    },
  })

  // Handle markdown input
  useEffect(() => {
    if (isMarkdownMode && editor) {
      // When switching to markdown mode, convert current content to markdown
      // This would require a HTML to Markdown converter
      // For simplicity, we'll just clear the editor content
      setMarkdown('')
    }
  }, [isMarkdownMode, editor])

  // Parse markdown to HTML when exiting markdown mode
  const handleMarkdownSubmit = () => {
    if (editor && markdown) {
      const html = mdParser.render(markdown)
      editor.commands.setContent(html)
      setIsMarkdownMode(false)
    }
  }

  // Handle image upload
  const addImage = () => {
    if (!editor) return
    
    const url = window.prompt('Enter image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  // Handle link insertion
  const setLink = () => {
    if (!editor) return
    
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', previousUrl)
    
    if (url === null) return
    
    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    
    editor.chain().focus().setLink({ href: url }).run()
  }

  // Generate table of contents from headings
  const generateTOC = () => {
    if (!editor) return
    
    const headings = [] as { level: number; text: string; id: string }[]
    
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        const id = `heading-${headings.length + 1}`
        const text = node.textContent
        headings.push({
          level: node.attrs.level,
          text,
          id,
        })
      }
    })
    
    if (headings.length > 0) {
      let tocHtml = '<div class="table-of-contents"><h3>Table of Contents</h3><ul>'
      
      headings.forEach(heading => {
        tocHtml += `<li class="toc-level-${heading.level}"><a href="#${heading.id}">${heading.text}</a></li>`
      })
      
      tocHtml += '</ul></div>'
      
      // Insert TOC at cursor position
      editor.chain().focus().insertContent(tocHtml).run()
    } else {
      alert('No headings found to generate table of contents')
    }
  }
  
  // Handle code blocks
  const toggleCodeBlock = () => {
    if (!editor) return
    editor.chain().focus().toggleCodeBlock().run()
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (!editor) {
    return null
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="rich-text-toolbar">
        {/* Text formatting */}
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        
        <span className="rich-text-separator" />
        
        {/* Headings */}
        <select 
          onChange={(e) => {
            const value = e.target.value
            if (value === '0') {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(value) as 1|2|3|4|5|6 }).run()
            }
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            editor.isActive('heading', { level: 4 }) ? '4' :
            editor.isActive('heading', { level: 5 }) ? '5' :
            editor.isActive('heading', { level: 6 }) ? '6' : '0'
          }
        >
          <option value="0">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
        
        <span className="rich-text-separator" />
        
        {/* Lists */}
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          • List
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Ordered List"
        >
          1. List
        </button>
        
        <span className="rich-text-separator" />
        
        {/* Block elements */}
        <button 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Blockquote"
        >
          Quote
        </button>
        <button 
          onClick={toggleCodeBlock}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="Code Block"
        >
          Code
        </button>
        
        <span className="rich-text-separator" />
        
        {/* Media and Links */}
        <button onClick={setLink} title="Add Link">
          Link
        </button>
        <button onClick={addImage} title="Add Image">
          Image
        </button>
        <button 
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          title="Insert Table"
        >
          Table
        </button>
        
        <span className="rich-text-separator" />
        
        {/* Utilities */}
        <button onClick={generateTOC} title="Generate Table of Contents">
          TOC
        </button>
        <button 
          onClick={() => setIsMarkdownMode(!isMarkdownMode)}
          className={isMarkdownMode ? 'is-active' : ''}
          title="Markdown Mode"
        >
          Markdown
        </button>
      </div>
      
      {isMarkdownMode ? (
        <div className="markdown-mode">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write markdown here..."
            className="markdown-textarea"
          />
          <button 
            onClick={handleMarkdownSubmit}
            className="markdown-submit"
          >
            Apply Markdown
          </button>
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}

export default RichTextEditor