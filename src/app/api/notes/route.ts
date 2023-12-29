import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export const NewNoteSchema = z.object({
  title: z
    .string({ required_error: "Note title is required" })
    .min(1, "Note title is required"),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const body = await req.json();
    const { title } = await NewNoteSchema.parseAsync(body);

    if (!body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    const image_description = await generateImagePrompt(title);

    if (!image_description) {
      return NextResponse.json(
        {
          error: "Failed to generate image description",
        },
        {
          status: 500,
        }
      );
    }

    const image_url = await generateImage(image_description);

    if (!image_url) {
      return NextResponse.json(
        {
          error: "Failed to generate image url",
        },
        {
          status: 500,
        }
      );
    }

    const note = await db
      .insert($notes)
      .values({
        title,
        userId,
        imageUrl: image_url,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Success generating note thumbnail",
        data: {
          note_id: note?.[0]?.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          message: "error generating note thumbnail",
          error: String(error),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "error generating note thumbnail",
        error,
      },
      { status: 500 }
    );
  }
}
