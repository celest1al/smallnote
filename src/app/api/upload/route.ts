import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const PostUploadImageSchema = z.object({
  note_id: z
    .number({ required_error: "Note id is required" })
    .min(1, { message: "Note id is required" }),
});

type PostUploadImage = z.infer<typeof PostUploadImageSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { note_id } = (await PostUploadImageSchema.parseAsync(
      body,
    )) as PostUploadImage;

    const notes = await db.select().from($notes).where(eq($notes.id, note_id));

    if (notes.length === 0) {
      return NextResponse.json(
        { message: `Note with id ${note_id} is not found` },
        { status: 404 },
      );
    }

    if (notes.length > 1) {
      return NextResponse.json(
        { message: "Multiple notes are found" },
        { status: 500 },
      );
    }

    const note = notes[0];

    if (!note.imageUrl) {
      return NextResponse.json(
        { message: `Image URL from note with id ${note_id} is not found` },
        { status: 500 },
      );
    }

    const firebaseUrl = await uploadFileToFirebase(note.imageUrl, note.title);

    await db
      .update($notes)
      .set({
        imageUrl: firebaseUrl,
      })
      .where(eq($notes.id, note_id));

    return NextResponse.json(
      {
        message: "Success upload image to firebase",
        success: true,
        data: {
          note_id,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          message: "error upload image",
          error: String(error),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "error upload image",
        error,
      },
      { status: 500 },
    );
  }
}
