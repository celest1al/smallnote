"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { NewNoteSchema } from "@/app/api/notes/route";

export function CreateNoteDialog() {
  const form = useForm<z.infer<typeof NewNoteSchema>>({
    resolver: zodResolver(NewNoteSchema),
  });
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

        console.log(data);
        return data;
      } catch (error) {
        console.error("error mutate create note", error);
      }
    },
  });

  const onSubmitNewNote = async (value: z.infer<typeof NewNoteSchema>) => {
    try {
      const note = await createNotebook.mutate(value.title, {
        onSuccess: () => console.log("success"),
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
            "border-dashed border-2 border-violet-600 h-full rounded-lg",
            "items-center justify-center flex hover:shadow-xl transition",
            "hover:-translate-y-1 flex-row p-4 gap-3"
          )}
        >
          <Plus className="w-6 h-6 text-violet-600" strokeWidth={3} />
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
            <div className="flex items-center pt-4 gap-4">
              <Button className="bg-red-600" type="reset">
                Cancel
              </Button>
              <Button className="bg-violet-600" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
