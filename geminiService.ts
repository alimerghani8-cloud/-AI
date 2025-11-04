
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-pro';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        isAI: { 
            type: Type.BOOLEAN,
            description: 'True if the text is likely AI-generated, false if it is likely human-written.'
        },
        confidence: { 
            type: Type.NUMBER,
            description: 'A percentage value (0-100) representing the confidence level of the prediction.'
        },
        reasoning: { 
            type: Type.STRING,
            description: 'A brief, one-sentence explanation for the decision, written in Arabic.'
        },
    },
    required: ['isAI', 'confidence', 'reasoning'],
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `حلل النص التالي وحدد ما إذا كان قد كتبه الذكاء الاصطناعي أم إنسان. قدم تحليلك بتنسيق JSON.
            ---
            ${text}
            ---
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.1
            }
        });

        const resultText = response.text.trim();
        const parsedResult = JSON.parse(resultText);

        // Basic validation
        if (typeof parsedResult.isAI !== 'boolean' || typeof parsedResult.confidence !== 'number') {
            throw new Error("Invalid response format from API.");
        }
        
        return parsedResult as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing text with Gemini API:", error);
        throw new Error("فشل تحليل النص. يرجى المحاولة مرة أخرى.");
    }
};
