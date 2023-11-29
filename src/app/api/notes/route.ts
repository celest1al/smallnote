import { generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

export const NewNoteSchema = z.object({
  title: z
    .string({ required_error: "Note title is required" })
    .min(1, "Note title is required"),
});

export async function POST(req: NextRequest) {
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

    console.log("image_description", image_description);

    return NextResponse.json(
      {
        message: "Success generating note thumbnail",
        data: {
          image_description,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error generating note thumbnail ", error);
    return NextResponse.json(
      {
        message: "error generating note thumbnail",
        error,
      },
      { status: 500 }
    );
  }
}
