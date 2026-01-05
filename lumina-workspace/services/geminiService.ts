
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContent = async (prompt: string, context?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context of current page content: ${context || 'None'}\n\nTask: ${prompt}\n\nProvide a clean, well-formatted response suitable for a document block.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Content Generation Error:", error);
    return "Error generating content.";
  }
};

export async function* generateContentStream(prompt: string, context?: string) {
  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: context
        ? `Page Content: ${context}\n\nInstruction: ${prompt}`
        : prompt,
      config: {
        temperature: 0.7,
      }
    });

    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Streaming Error:", error);
    yield "Error during generation.";
  }
}

export const suggestBlockTransformation = async (blockContent: string, instruction: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Original text: "${blockContent}"\n\nInstruction: ${instruction}\n\nProvide ONLY the transformed text.`,
    });

    return response.text;
  } catch (error) {
    return blockContent;
  }
};

export const chatWithPage = async (pageContext: string, question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful assistant analyzing a document.\n\nDocument Content:\n${pageContext}\n\nUser Question: ${question}\n\nAnswer based mostly on the document content.`,
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble analyzing the page right now.";
  }
};
