import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const PostCompletionSchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required" })
    .min(1, { message: "Prompt is required" }),
});

type PostCompletion = z.infer<typeof PostCompletionSchema>;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PostCompletion;
    const { prompt } = await PostCompletionSchema.parseAsync(body);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences.
         The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
         AI is well-behaved and well-mannered individual.
         AI is always friendly, kind, inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        `,
        },
        {
          role: "user",
          content: `
          I am writing a piece of text in a notion text editor app.
          Help me complete my train of thought here: **${prompt}**
          keep the tone of the text consistent with the rest of the text.
          keep the response short and sweet.
          `,
        },
      ],
      stream: true,
    });
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof TypeError) {
      return NextResponse.json(
        {
          message: "error generate completion",
          error: String(error),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "error generate completion",
        error,
      },
      { status: 500 },
    );
  }
}
