import { GoogleGenAI, Type } from "@google/genai";
import { JobProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askAIAssistant(prompt: string, evaluations: any[], lang: 'ar' | 'en' = 'ar') {
  const context = `
    You are an AI assistant for an HR CV Screening System.
    Here is the current data of evaluated candidates:
    ${JSON.stringify(evaluations.map(e => ({
      name: e.candidateName,
      score: e.score,
      decision: e.decision,
      strengths: e.keyStrengths,
      weaknesses: e.keyWeaknesses
    })))}
    
    Please answer the user's question based on this data. Be concise and helpful.
    The response MUST be in ${lang === 'ar' ? 'Arabic' : 'English'}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: context }, { text: prompt }] },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return text;
}

export async function evaluateCV(file: File, profile: JobProfile, lang: 'ar' | 'en' = 'ar') {
  const filePart = await fileToGenerativePart(file);
  
  const promptAr = `
    أنت خبير موارد بشرية (HR). قم بتقييم السيرة الذاتية المرفقة بناءً على متطلبات الوظيفة التالية:
    - المسمى الوظيفي: ${profile.title}
    - المجال: ${profile.field}
    - الخبرة المطلوبة: ${profile.experience}
    - المهارات المطلوبة: ${profile.skills}
    - متطلبات أخرى: ${profile.other}

    قم باستخراج اسم المرشح، إعطاء تقييم من 0 إلى 100 لمدى تطابق السيرة الذاتية مع المتطلبات، استخراج أهم المميزات ونقاط القوة، استخراج أبرز العيوب أو المتطلبات المفقودة، وكتابة ملخص سريع.
    يجب أن يكون الرد باللغة العربية.
  `;

  const promptEn = `
    You are an HR expert. Evaluate the attached CV based on the following job requirements:
    - Job Title: ${profile.title}
    - Field: ${profile.field}
    - Required Experience: ${profile.experience}
    - Required Skills: ${profile.skills}
    - Other Requirements: ${profile.other}

    Extract the candidate's name, provide a match score from 0 to 100 based on how well the CV matches the requirements, extract key strengths, extract key weaknesses or missing requirements, and write a quick summary.
    The response MUST be in English.
  `;

  const prompt = lang === 'en' ? promptEn : promptAr;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [filePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidateName: { type: Type.STRING, description: lang === 'en' ? "Candidate Name" : "اسم المرشح" },
          score: { type: Type.NUMBER, description: lang === 'en' ? "Match score from 0 to 100" : "نسبة التطابق من 0 إلى 100" },
          keyStrengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: lang === 'en' ? "Key strengths" : "أهم المميزات ونقاط القوة"
          },
          keyWeaknesses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: lang === 'en' ? "Key weaknesses or missing requirements" : "أبرز العيوب أو نقاط الضعف أو المتطلبات المفقودة"
          },
          summary: { type: Type.STRING, description: lang === 'en' ? "Quick summary" : "ملخص سريع لمدى ملاءمة المرشح" }
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
