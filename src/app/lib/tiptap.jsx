"use client"
import {EditorContent, useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Document from "@tiptap/extension-document"
import Heading from "@tiptap/extension-heading"
import Underline from "@tiptap/extension-underline"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Placeholder from "@tiptap/extension-placeholder"
import {BubbleMenu} from "@tiptap/react/menus"
import {HeadingTool} from "@/app/lib/headingTool"

export function TiptapEditor({
                                 content = "",
                                 placeholder = "Tulis sesuatu di sini...",
                                 onChange,
                                 editable = true,
                                 className = "",
                                 minHeight = "200px",
                                 maxHeight = "none",
                                 showToolbar = true
                             }) {
    const editor = useEditor({
        extensions: [
            Document,
            StarterKit.configure({
                document: false,
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Heading.configure({levels: [1, 2, 3, 4, 5, 6]}),
            Underline,
            Highlight,
            Link.configure({openOnClick: false}),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'tiptap-tasklist',
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'tiptap-taskitem',
                },
            }),
            Placeholder.configure({placeholder}),
        ],
        content: content || `<p></p>`,
        editable,
        immediatelyRender: false,
        onUpdate: ({editor}) => {
            if (onChange) {
                onChange(editor.getHTML())
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none max-w-none',
            },
        },
    })

    if (!editor) return null

    const headings = [1, 2, 3, 4, 5, 6]

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Bubble Menu Toolbar */}
            {showToolbar && (
                <BubbleMenu className="z-[9999]" editor={editor}>
                    <div
                        className="flex flex-wrap gap-1 p-2 rounded-lg shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`px-3 py-1.5 text-sm font-semibold rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            B
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`px-3 py-1.5 text-sm italic rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            I
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`px-3 py-1.5 text-sm underline rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            U
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={`px-3 py-1.5 text-sm line-through rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            S
                        </button>

                        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        <button
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            className={`px-3 py-1.5 text-sm rounded hover:bg-yellow-100 dark:hover:bg-yellow-700 transition-colors ${
                                editor.isActive('highlight') ? 'bg-yellow-200 dark:bg-yellow-600' : 'bg-yellow-50 dark:bg-yellow-900'
                            }`}
                        >
                            H
                        </button>

                        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            • List
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            1. List
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={`px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            "
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            className={`px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            &lt;/&gt;
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            className={`px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                editor.isActive('taskList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                            }`}
                        >
                            ☑
                        </button>

                        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        <button
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ↶
                        </button>
                        <button
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ↷
                        </button>

                        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

                        {/* Heading Tool */}
                        <HeadingTool editor={editor} headings={headings}/>
                    </div>
                </BubbleMenu>
            )}

            {/* Editor Content */}
            <div
                className="flex-1 overflow-y-auto"
                style={{
                    minHeight,
                    maxHeight: maxHeight !== "none" ? maxHeight : undefined
                }}
            >
                <EditorContent
                    editor={editor}
                    className="h-full focus:outline-none dark:prose-invert max-w-none p-4"
                />
            </div>
        </div>
    )
}