import { DeleteButton } from "@/components/delete-button";
import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

type NotePageProps = {
  params: {
    note_id: string;
  };
};

export default async function NotePage({ params }: NotePageProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await clerk.users.getUser(userId);

  const notes = await db
    .select()
    .from($notes)
    .where(
      and(eq($notes.id, Number(params?.note_id)), eq($notes.userId, userId)),
    );

  if (notes.length !== 1) {
    return redirect("/dashboard");
  }

  const note = notes[0];

  return (
    <main className="grainy min-h-dvh p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {/* header */}
        <div className="flex items-center rounded-lg border border-stone-200 p-4 shadow-xl">
          <Link href="/dashboard" className="pr-4">
            <Button className="bg-violet-600" type="button">
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
            <span>/</span>
            <span className="font-semibold text-stone-500">{note?.title}</span>
          </div>
          <div className="ml-auto">
            <DeleteButton noteId={note.id} />
          </div>
        </div>

        {/* editor */}
        <div className="w-full rounded-lg border border-stone-200 px-16 py-8 shadow-xl">
          <Editor note={note} />
        </div>
      </div>
    </main>
  );
}
