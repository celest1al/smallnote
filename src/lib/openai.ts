import { Configuration, OpenAIApi } from "openai-edge";

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

    console.log("image_description", image_description);

    return image_description as string;
  } catch (error) {
    console.error("error generating thumbnail description ", error);
    throw error;
  }
}

export async function generateImage() {}
