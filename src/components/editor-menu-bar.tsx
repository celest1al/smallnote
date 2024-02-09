"use client";

import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  CodeSquare,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Text,
  Undo,
} from "lucide-react";

type EditorMenuBarProps = {
  editor: Editor;
};

export function EditorMenuBar({ editor }: EditorMenuBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn("px-2 py-1", editor?.isActive("bold") ? "is-active" : "")}
      >
        <Bold className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "px-2 py-1",
          editor?.isActive("italic") ? "is-active" : "",
        )}
      >
        <Italic className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          "px-2 py-1",
          editor?.isActive("strike") ? "is-active" : "",
        )}
      >
        <Strikethrough className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn("px-2 py-1", editor?.isActive("code") ? "is-active" : "")}
      >
        <Code className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        className={cn(
          "px-2 py-1",
          editor?.isActive("codeBlock") ? "is-active" : "",
        )}
      >
        <CodeSquare className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={cn(
          "px-2 py-1",
          editor?.isActive("heading", { level: 1 }) ? "is-active" : "",
        )}
      >
        <Heading1 className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={cn(
          "px-2 py-1",
          editor?.isActive("heading", { level: 2 }) ? "is-active" : "",
        )}
      >
        <Heading2 className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={cn(
          "px-2 py-1",
          editor?.isActive("heading", { level: 3 }) ? "is-active" : "",
        )}
      >
        <Heading3 className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 4 }).run()
        }
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 4 }).run()
        }
        className={cn(
          "px-2 py-1",
          editor?.isActive("heading", { level: 4 }) ? "is-active" : "",
        )}
      >
        <Heading4 className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 5 }).run()
        }
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 5 }).run()
        }
        className={cn(
          "px-2 py-1",
          editor?.isActive("heading", { level: 5 }) ? "is-active" : "",
        )}
      >
        <Heading5 className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 6 }).run()
        }
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 6 }).run()
        }
        className={cn(
          "px-2 py-1",
          editor?.isActive("heading", { level: 6 }) ? "is-active" : "",
        )}
      >
        <Heading6 className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().setParagraph().run()}
        disabled={!editor.can().chain().focus().setParagraph().run()}
        className={cn(
          "px-2 py-1",
          editor?.isActive("paragraph") ? "is-active" : "",
        )}
      >
        <Text className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={cn(
          "px-2 py-1",
          editor?.isActive("bulletList") ? "is-active" : "",
        )}
      >
        <List className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={cn(
          "px-2 py-1",
          editor?.isActive("orderedList") ? "is-active" : "",
        )}
      >
        <ListOrdered className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        className={cn(
          "px-2 py-1",
          editor?.isActive("blockquote") ? "is-active" : "",
        )}
      >
        <Quote className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-6 w-6" />
      </button>
    </div>
  );
}
