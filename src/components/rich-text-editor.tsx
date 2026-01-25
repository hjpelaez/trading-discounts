"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
    Bold, Italic, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo,
    Type, Quote, Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuButton = ({
    onClick,
    active,
    children,
    title
}: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
            "p-2 rounded-md transition-colors",
            active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted text-muted-foreground"
        )}
    >
        {children}
    </button>
);

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline font-bold",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-2xl border border-border shadow-lg my-8 max-w-full h-auto mx-auto block",
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || "Start writing your article here...",
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[250px] p-6",
            },
        },
    });

    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt("Enter URL");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Enter image URL");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-border">
                {/* Text Style */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive("underline")}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Alignment */}
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    active={editor.isActive({ textAlign: 'justify' })}
                    title="Justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive("heading", { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    active={editor.isActive("paragraph")}
                    title="Paragraph"
                >
                    <Type className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists & Extras */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-border mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                    title="Quote"
                >
                    <Quote className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Divider"
                >
                    <Minus className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Media */}
                <MenuButton onClick={addLink} active={editor.isActive("link")} title="Add Link">
                    <LinkIcon className="h-4 w-4" />
                </MenuButton>
                <MenuButton onClick={addImage} title="Add Image">
                    <ImageIcon className="h-4 w-4" />
                </MenuButton>

                <div className="flex-1" />

                {/* History */}
                <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo className="h-4 w-4" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo className="h-4 w-4" />
                </MenuButton>
            </div>

            <EditorContent editor={editor} className="bg-background transition-all" />
        </div>
    );
}
