"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { EditorMenuBar } from "./editor-menu-bar";
import { Button } from "./ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { Note } from "@/lib/db/schema";
import { Loader } from "lucide-react";
import Text from "@tiptap/extension-text";
import { useCompletion } from "ai/react";

type EditorProps = {
  note: Note;
};

export function Editor({ note }: EditorProps) {
  const [editorState, setEditorState] = useState(note?.editorState);
  const debounceEditorState = useDebounce(editorState);
  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });
  const { mutate: updateNoteMutate, isPending } = useMutation({
    mutationKey: ["update-note", debounceEditorState],
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/notes/${note.id}`, {
          method: "PUT",
          body: JSON.stringify({
            editorState: debounceEditorState,
          }),
        });

        const data = await response.json();

        return data;
      } catch (error) {
        console.error("error updating editor state", String(error));
      }
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-Mod-a": () => {
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor?.getHTML());
    },
  });

  const lastCompletion = useRef("");

  useEffect(() => {
    if (!editor || !completion) return;

    const diff = completion.slice(lastCompletion?.current?.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  useEffect(() => {
    if (!debounceEditorState) return;

    updateNoteMutate(undefined, {
      onSuccess: (data) => console.log("success update the note: ", data),
      onError: (err) => console.error(err?.message),
    });
  }, [debounceEditorState, updateNoteMutate]);

  return (
    <div className="prose flex flex-col gap-5">
      <div className="flex gap-4">
        {editor ? (
          <>
            <EditorMenuBar editor={editor} />
            <Button disabled variant="outline" className="w-[100px]">
              {isPending ? <Loader className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </>
        ) : null}
      </div>
      <div className="prose w-full py-4">
        <EditorContent editor={editor} />
      </div>
      <span className="text-sm">
        Tip: press{" "}
        <kbd className="rounded-lg border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
          Shift + Mod + a
        </kbd>{" "}
        For AI autocomplete
      </span>
    </div>
  );
}
