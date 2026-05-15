import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI lazily to avoid build-time errors when the API key is missing
const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // In build time, this might be called by Next.js static analysis
    // We handle it gracefully or let it throw only when actually used
    return null;
  }
  return new OpenAI({ apiKey });
};

export async function POST(req: Request) {
  try {
    const { image } = await req.json(); // base64 image

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json({ error: "OpenAI API Key is not configured" }, { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this invoice image and extract: amount, vendor name, date, and category. Respond ONLY with a JSON object." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = response.choices[0].message.content;
    return NextResponse.json(JSON.parse(result!));
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "Failed to scan invoice" }, { status: 500 });
  }
}
