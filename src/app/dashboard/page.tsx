import { CreateNoteDialog } from "@/components/create-note-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const { userId } = auth();
  const notes = await db
    .select()
    .from($notes)
    .where(eq($notes.userId, userId!));

  return (
    <>
      <div className="grainy min-h-screen">
        <div className="mx-auto max-w-7xl p-10">
          <div className="flex flex-col items-center justify-between pt-14 md:flex-row">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button className="bg-violet-600">
                  <ArrowLeft className="mr-1 h-5 w-5" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My notes</h1>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
          <Separator className="my-8" />
          {notes.length === 0 ? (
            <div className="text-center">
              <h2 className="text-xl text-gray-500">You have no notes yet.</h2>
            </div>
          ) : null}

          {/* display all the notes */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
            <CreateNoteDialog />
            {notes.map((note) => {
              return (
                <a key={note.id} href={`/note/${note.id}`}>
                  <div className="flex h-full min-h-[300px] -translate-y-1 flex-col gap-3 overflow-hidden rounded-lg border border-stone-200 pb-4 transition hover:shadow-xl">
                    <Image
                      src={note.imageUrl!}
                      alt={note.title}
                      width={400}
                      height={200}
                    />
                    <div className="flex flex-col gap-1 p-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(note.createAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
