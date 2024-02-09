import { Configuration, OpenAIApi } from "openai-edge";
import { Note } from "./db/schema";

const openaiApiKey = process.env.OPENAI_API_KEY ?? "";

const config = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(noteTitle: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a creative and helpful AI assistant capable of generating interesting and engaging thumbnail description for my note. Your output will be fed into the DALL-E API to generate a beautiful, creative and engaging thumbnail.
                    The description should be minimalistic and flat style`,
        },
        {
          role: "user",
          content: `Please a generate a thumbnail description for my notebook with title ${noteTitle}`,
        },
      ],
    });

    const data = await response.json();

    if (data?.error) {
      console.error(data?.error?.message);

      throw new Error(data?.error?.message);
    }

    const image_description = data?.choices?.[0]?.message?.content;

    return image_description as string;
  } catch (error) {
    console.error("error generating thumbnail description ", error);
    throw error;
  }
}

export async function generateImage(image_description: string) {
  try {
    const response = await openai.createImage({
      prompt: image_description,
      n: 1,
      size: "256x256",
    });

    const data = await response.json();
    const image_url = data?.data?.[0]?.url;

    return image_url as string;
  } catch (error) {
    console.error("error generating image ", error);
    throw error;
  }
}
