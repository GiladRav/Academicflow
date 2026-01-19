
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Priority, TaskCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const breakdownTaskWithAI = async (task: Partial<Task>) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down this academic task into manageable sub-tasks for a college student: 
      Title: ${task.title}
      Description: ${task.description}
      Category: ${task.category}
      Due Date: ${task.dueDate}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            breakdown: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 3-7 specific sub-tasks."
            },
            estimatedHours: {
              type: Type.NUMBER,
              description: "Total estimated study/work hours."
            },
            proTip: {
              type: Type.STRING,
              description: "A quick study tip for this specific type of task."
            }
          },
          required: ["breakdown", "estimatedHours", "proTip"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI breakdown failed", error);
    return null;
  }
};

export const getSmartAdvice = async (tasks: Task[]) => {
  try {
    const summary = tasks.map(t => `${t.title} (Due: ${t.dueDate}, Priority: ${t.priority})`).join(', ');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an academic advisor, look at this student's schedule and give 3 short, punchy pieces of advice on what they should focus on first and why.
      Tasks: ${summary}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI advice failed", error);
    return "Keep focusing on your deadlines!";
  }
};
