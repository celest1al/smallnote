"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { EditorMenuBar } from "./editor-menu-bar";
import { Button } from "./ui/button";

export function Editor() {
  const [editorState, setEditorState] = useState("<p>Hello World! 🌎️</p>");
  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit.configure({
    })],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor?.getHTML());
    },
  });

  return (
    <div className="flex flex-col gap-5 prose">
      <div className="flex gap-4">
        {editor ? <EditorMenuBar editor={editor} /> : null}
        <Button>Saved</Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
