"use client";

import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose,
} from "./ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DeleteButtonProps {
  noteId: number;
}

export function DeleteButton({ noteId }: DeleteButtonProps) {
  const [isRendered, setIsRendered] = useState(false);
  const router = useRouter();
  const deleteNote = useMutation({
    mutationKey: ["delete-note"],
    mutationFn: async () => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    },
  });

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return (
    <>
      {isRendered ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="text-sm">
              <Trash className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this note?
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-4 pt-4">
              <DialogClose asChild>
                <Button className="w-[100px]" variant="secondary" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={deleteNote?.isPending}
                className="w-[100px]"
                variant="destructive"
                type="button"
                onClick={() =>
                  deleteNote.mutate(undefined, {
                    onSuccess: () => router.push("/dashboard"),
                  })
                }
              >
                {deleteNote?.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
