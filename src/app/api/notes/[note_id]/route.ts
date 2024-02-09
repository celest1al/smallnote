import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateNoteSchema = z.object({
  editorState: z
    .string({ required_error: "Editor state is required" })
    .min(1, { message: "Editor state is required" }),
});

type UpdateNote = z.infer<typeof UpdateNoteSchema>;

export async function GET(
  _: Request,
  { params }: { params: { note_id: string } },
) {
  try {
    const note_id = params?.note_id;

    if (isNaN(Number(note_id))) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 500 });
    }

    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes?.id, Number(note_id)));

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

    return NextResponse.json(
      {
        data: note,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          message: "error getting the note",
          error: String(error),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "error getting the note",
        error,
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { note_id: string } },
) {
  try {
    const note_id = params?.note_id;

    if (isNaN(Number(note_id))) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 500 });
    }

    const body = (await req.json()) as UpdateNote;

    if (!body) {
      return NextResponse.json(
        { message: "Missing note_id or editor state" },
        { status: 400 },
      );
    }

    const { editorState } = await UpdateNoteSchema.parseAsync(body);

    if (!Number(note_id) || !editorState) {
      return NextResponse.json(
        { message: "Missing note_id or editor state" },
        { status: 400 },
      );
    }

    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, Number(note_id)));

    if (notes.length === 0) {
      return NextResponse.json(
        { message: "Note does not exists" },
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

    if (note.editorState !== editorState) {
      await db
        .update($notes)
        .set({ editorState })
        .where(eq($notes.id, Number(note_id)));
    }

    return NextResponse.json(
      { success: true, message: "Note state updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          message: "error updating note state",
          error: String(error),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "error updating note state",
        error,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { note_id: string } },
) {
  try {
    const note_id = params?.note_id;

    if (isNaN(Number(note_id))) {
      return NextResponse.json({ message: "Invalid note id" }, { status: 500 });
    }

    await db.delete($notes).where(eq($notes.id, Number(note_id)));

    return NextResponse.json(
      {
        message: `Note with id ${note_id} is successfully deleted`,
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          message: "error deleting the note",
          error: String(error),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "error deleting the note",
        error,
      },
      { status: 500 },
    );
  }
}
