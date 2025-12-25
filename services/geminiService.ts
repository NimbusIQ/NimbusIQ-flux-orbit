import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ICP, Feedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ICP_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    role: { type: Type.STRING, description: "Job title of the ideal customer" },
    companySize: { type: Type.STRING, description: "Size of the company (e.g., SMB, Enterprise)" },
    painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3-5 pain points" },
    goals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3-5 professional goals" },
    buyingTriggers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Events that trigger a purchase" },
    preferredChannels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Marketing channels (LinkedIn, Email, etc.)" },
    techStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Current tools they likely use" },
  },
  required: ["role", "companySize", "painPoints", "goals"],
};

const FEEDBACK_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "A score from 1-100 on effectiveness" },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable steps to improve" },
    revisedContent: { type: Type.STRING, description: "An AI-generated improved version of the content" }
  },
  required: ["score", "strengths", "weaknesses", "suggestions", "revisedContent"],
};

export const generateICPProfile = async (verticalDescription: string): Promise<ICP> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a detailed Ideal Customer Profile (ICP) for a Native AI Vertical product described as: "${verticalDescription}". Focus on B2B buyers suitable for high-velocity sales or PLG.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ICP_SCHEMA,
        systemInstruction: "You are an expert Go-To-Market strategist for AI products.",
      },
    });

    const data = JSON.parse(response.text || "{}");
    return { ...data, id: crypto.randomUUID() };
  } catch (error) {
    console.error("ICP Gen Error", error);
    throw new Error("Failed to generate ICP.");
  }
};

export const generateCreativeFeedback = async (
  content: string,
  icpContext: ICP | null,
  type: string
): Promise<Feedback> => {
  try {
    let icpString = "Target Audience: General Tech B2B Audience.";

    if (icpContext) {
      icpString = `Target Audience Profile:
      - Role: ${icpContext.role}
      - Company Size: ${icpContext.companySize}
      - Pain Points: ${icpContext.painPoints.join(", ")}
      - Professional Goals: ${icpContext.goals.join(", ")}
      - Buying Triggers: ${icpContext.buyingTriggers.join(", ")}
      - Preferred Channels: ${icpContext.preferredChannels.join(", ")}
      - Tech Stack: ${icpContext.techStack.join(", ")}`;
    }

    const prompt = `Analyze this creative asset (${type}) based on the specific target audience profile below.
    
    ${icpString}
    
    Creative Content:
    "${content}"
    
    Provide a critique and a rewritten version that is more persuasive and specifically addresses the pain points and goals listed.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: FEEDBACK_SCHEMA,
        systemInstruction: "You are a world-class Creative Director and Copywriter.",
      },
    });

    const data = JSON.parse(response.text || "{}");
    return { ...data, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error("Feedback Gen Error", error);
    throw new Error("Failed to generate feedback.");
  }
};