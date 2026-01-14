import { GoogleGenAI } from "@google/genai";

// Fix: Follow @google/genai guidelines by initializing client inside the function 
// and using the correct model and property access.
export const generateSalesScript = async (clientName: string, product: string, mediaType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Service Unavailable: Please configure your API_KEY to use Gemini features. Mock response: นี่คือตัวอย่างสคริปต์การขาย...";
  }

  try {
    // Guidelines: Use 'gemini-3-pro-preview' for complex text generation tasks.
    const model = 'gemini-3-pro-preview';
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      Act as a senior Ad Sales Executive writing in Thai. Write a short, persuasive sales email script (max 150 words) to a client named "${clientName}".
      They are selling "${product}" and we want to pitch them our "${mediaType}" advertising space.
      Focus on high visibility, premium audience, and brand recall. Use professional but inviting Thai business language.
    `;

    // Guidelines: Call generateContent with model and contents parameters directly.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    // Guidelines: Access the generated text via the .text property (not a method).
    return response.text || "ไม่สามารถสร้างเนื้อหาได้";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "เกิดข้อผิดพลาดในการสร้างสคริปต์การขาย กรุณาลองใหม่อีกครั้ง";
  }
};