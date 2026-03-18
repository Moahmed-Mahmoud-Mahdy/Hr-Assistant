import { GoogleGenAI, Type } from "@google/genai";
import { JobProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function evaluateCV(file: File, profile: JobProfile) {
  const filePart = await fileToGenerativePart(file);
  
  const prompt = `
    أنت خبير موارد بشرية (HR). قم بتقييم السيرة الذاتية المرفقة بناءً على متطلبات الوظيفة التالية:
    - المسمى الوظيفي: ${profile.title}
    - المجال: ${profile.field}
    - الخبرة المطلوبة: ${profile.experience}
    - المهارات المطلوبة: ${profile.skills}
    - متطلبات أخرى: ${profile.other}

    قم باستخراج اسم المرشح، إعطاء تقييم من 0 إلى 100 لمدى تطابق السيرة الذاتية مع المتطلبات، استخراج أهم المميزات ونقاط القوة، استخراج أبرز العيوب أو المتطلبات المفقودة، وكتابة ملخص سريع.
    يجب أن يكون الرد باللغة العربية.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [filePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidateName: { type: Type.STRING, description: "اسم المرشح" },
          score: { type: Type.NUMBER, description: "نسبة التطابق من 0 إلى 100" },
          keyStrengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "أهم المميزات ونقاط القوة"
          },
          keyWeaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "أبرز العيوب أو نقاط الضعف أو المتطلبات المفقودة"
          },
          summary: { type: Type.STRING, description: "ملخص سريع لمدى ملاءمة المرشح" }
        },
        required: ["candidateName", "score", "keyStrengths", "keyWeaknesses", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text);
}

async function fileToGenerativePart(file: File) {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
