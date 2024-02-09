"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { NewNoteSchema } from "@/app/api/notes/route";
import { useRouter } from "next/navigation";

export function CreateNoteDialog() {
  const form = useForm<z.infer<typeof NewNoteSchema>>({
    resolver: zodResolver(NewNoteSchema),
    defaultValues: {
      title: "",
    },
  });
  const router = useRouter();

  const createNotebook = useMutation({
    mutationKey: ["create-note"],
    mutationFn: async (title: string) => {
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify({
            title,
          }),
        });
        const data = await response.json();

        return data;
      } catch (error) {
        console.error("error mutate create note", error);
      }
    },
  });

  const uploadFile = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (note_id: string) => {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          note_id,
        }),
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => router.push(`/note/${data?.data?.note_id}`),
  });

  const onSubmitNewNote = async (value: z.infer<typeof NewNoteSchema>) => {
    try {
      await createNotebook.mutate(value.title, {
        onSuccess: ({ data }) => {
          uploadFile.mutate(data?.note_id);
        },
        onError: (error) => console.log("error"),
      });
    } catch (error) {
      console.error("error submit new note", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "h-full rounded-lg border-2 border-dashed border-violet-600",
            "flex items-center justify-center transition hover:shadow-xl",
            "flex-row gap-3 p-4 hover:-translate-y-1",
          )}
        >
          <Plus className="h-6 w-6 text-violet-600" strokeWidth={3} />
          <h2 className="font-semibold text-violet-600">New note</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New note</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitNewNote)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Note title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="My inspiring note"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4 pt-4">
              <DialogClose asChild>
                <Button className="w-[100px] bg-red-600" type="reset">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={createNotebook?.isPending}
                className="w-[100px] bg-violet-600"
                type="submit"
              >
                {createNotebook?.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
