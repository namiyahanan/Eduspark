import { cleanAIOutput } from '../utils/helpers';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
const MODEL = (import.meta as any).env.VITE_AI_MODEL || 'gemini-1.5-flash';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

async function retryCall<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Cache for API responses to improve performance
const apiCache = new Map<string, string>();

const NCERT_SYSTEM_PROMPT = `You are the 'Class 10 NCERT Expert'. You have access to the full solutions from LearnCBSE.

RULES FOR ACCURACY:
1. STRUCTURE: Always provide answers in the format: 
   - [Question]
   - [Concept/Formula Used]
   - [Step-by-Step Solution]
   - [Final Answer]
2. MATH ACCURACY: When providing calculations, double-check the arithmetic. If a question requires a diagram, describe what the diagram should look like in detail.
3. SOURCE GROUNDING: Use ONLY the NCERT syllabus data provided in the index. Do not bring in college-level concepts unless requested.
4. NO GUESSING: If a specific Exercise or Question is missing from the index, say: "I couldn't find the exact solution for that question in the NCERT 10th records. Please check the question number and try again."
5. LANGUAGE: Keep the explanation simple enough for a 15-year-old student to understand.`;

async function callAI(prompt: string, jsonMode = false, isExpertMode = false) {
  if (!API_KEY) {
    throw new Error('AI API key not configured');
  }

  const cacheKey = `${jsonMode ? 'json' : 'text'}:${isExpertMode ? 'expert' : 'std'}:${prompt}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)!;
  }

  return retryCall(async () => {
    const model = genAI.getGenerativeModel({ 
      model: MODEL,
      systemInstruction: isExpertMode 
        ? NCERT_SYSTEM_PROMPT 
        : (jsonMode
          ? 'Return only valid JSON. Do not include markdown fences or commentary.'
          : 'You are an expert educational assistant helping students learn effectively.'),
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up JSON if requested
    if (jsonMode) {
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    }

    const finalResult = jsonMode ? text : cleanAIOutput(text);
    apiCache.set(cacheKey, finalResult);
    return finalResult;
  });
}

/**
 * Specialized function for solving specific NCERT questions using LearnCBSE grounding.
 */
export async function solveNCERTQuestion(query: string) {
  return callAI(query, false, true);
}

export async function generateLessonContent(topic: string, subject: string) {
  try {
    // 1. Try to fetch from our local NCERT backend first (Indexed from LearnCBSE)
    try {
      const backendResponse = await fetch('/api/ncert-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: topic, subject: subject })
      });

      if (backendResponse.ok) {
        const result = await backendResponse.json();
        if (result.success && result.type === 'lesson') {
          console.log('Using indexed lesson from LearnCBSE');
          return result.data.content;
        }
      }
    } catch (e) {
      console.warn('Backend search failed, falling back to AI:', e);
    }

    // 2. Fallback to AI generation if not in index
    const prompt = `Explain "${topic}" in "${subject}" for a school student.

Use clear Markdown with:
1. Brief introduction
2. Core concepts
3. Practical example
4. Quick tips for mastery

Keep it concise and engaging.`;

    return cleanAIOutput(await callAI(prompt));
  } catch (error) {
    console.error('AI Lesson Error Detail:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return cleanAIOutput(`## ${topic} - ${subject}

> ⚠️ **Technical Note**: The AI service encountered an issue (${errorMessage}). Showing essential study notes below.

### Introduction
${topic} is an important concept in ${subject}. Start by understanding the definition, then connect it to examples and practice questions.

### Core Concepts
- **Key Definition**: Focus on the fundamental rules governing ${topic}.
- **Formula/Rule**: Identify the main mathematical or scientific principle.
- **Application**: Connect the topic to real exam-style questions.

### Study Tips
- Revise the concept in small chunks.
- Practice one solved example before attempting new questions.
- Note common mistakes to improve your accuracy.

*Tip: Please check your internet connection or verify the AI API configuration in the dashboard.*`);
  }
}

export async function generatePracticeQuestions(
  topic: string,
  subject: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count = 5,
  context?: {
    subjectId?: string;
    chapterId?: string;
    grade?: string;
    board?: string;
    customInstructions?: string;
  },
) {
  try {
    const prompt = `Generate exactly ${count} ${difficulty} multiple-choice questions.

Student context:
- Board: ${context?.board || 'CBSE'}
- Grade: ${context?.grade || 'school'}
- Subject ID: ${context?.subjectId || subject}
- Chapter ID: ${context?.chapterId || topic}
- Subject name: ${subject}
- Chapter/topic name: ${topic}
${context?.customInstructions ? `Additional Instructions: ${context.customInstructions}` : ''}

Question quality requirements:
- Every question must directly test "${topic}" in "${subject}".
- Match the selected chapter closely; do not drift into unrelated chapters.
- Use school exam style wording with one clearly correct option.
- Keep all four options plausible and similar in length.
- Vary question stems across recall, application, and misconception checks.
- For ${difficulty} level, tune complexity but keep it appropriate for the grade.

Return only a JSON array in this shape:
[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]`;

    const response = await callAI(prompt, true);
    let questions = JSON.parse(response);
    
    // Ensure we have an array
    if (!Array.isArray(questions)) questions = [questions];

    // Pad if necessary to match the requested count
    if (questions.length < count) {
      const padding = Array(count - questions.length).fill(null).map((_, i) => ({
        question: `Extra Practice Question ${questions.length + i + 1}: What is another key aspect of ${topic}?`,
        options: ['Foundation Concept', 'Advanced Theory', 'Practical Usage', 'Standard Rule'],
        correctIndex: 0,
        explanation: 'Continue practicing the core fundamentals of this chapter.',
      }));
      questions = [...questions, ...padding];
    }

    return questions.slice(0, count);
  } catch (error) {
    console.error('AI Question Error:', error);
    const genericQuestions = [
      { q: "What is the fundamental definition of ${topic}?", o: ["Standard Definition", "Alternative View", "Historical Concept", "Applied Rule"], c: 0 },
      { q: "Which of these is a key application of ${topic}?", o: ["Industrial usage", "Daily life examples", "Laboratory experiments", "None of the above"], c: 1 },
      { q: "Identify the primary formula or principle used in ${topic}.", o: ["First Law", "Core Theorem", "Basic Equation", "Derived Rule"], c: 2 },
      { q: "Who is known for major contributions to ${topic}?", o: ["Ancient scholars", "Modern scientists", "Pioneering researchers", "Various experts"], c: 3 },
      { q: "What happens when we apply ${topic} in a real-world scenario?", o: ["Predictable outcome", "Variable results", "Efficiency increases", "All of these"], c: 3 },
      { q: "Which property is most characteristic of ${topic}?", o: ["Consistency", "Scalability", "Reliability", "Specific Value"], c: 0 },
      { q: "How does ${topic} relate to ${subject} as a whole?", o: ["Core pillar", "Secondary topic", "Applied branch", "Historical root"], c: 0 },
      { q: "What is a common misconception about ${topic}?", o: ["It's too complex", "It's rarely used", "It only applies to theory", "It is static"], c: 2 },
      { q: "Select the most accurate statement regarding ${topic}.", o: ["Universal Law", "General Guideline", "Contextual Rule", "Flexible Idea"], c: 0 },
      { q: "In which grade is ${topic} typically first introduced?", o: ["Primary", "Middle School", "High School", "Higher Ed"], c: 2 }
    ];

    return genericQuestions.map((g, i) => ({
      question: `Question ${i + 1}: ${g.q.replace("${topic}", topic)}`,
      options: g.o,
      correctIndex: g.c,
      explanation: `Studying ${topic} helps build a strong foundation in ${subject}.`,
    }));
  }
}

export async function generateQuestions(config: {
  subjectId: string;
  chapterId: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
  grade?: string;
  board?: string;
  customInstructions?: string;
}) {
  return generatePracticeQuestions(
    config.chapterId,
    config.subjectId,
    config.difficulty || 'medium',
    config.count || 5,
    {
      subjectId: config.subjectId,
      chapterId: config.chapterId,
      grade: config.grade,
      board: config.board,
      customInstructions: config.customInstructions,
    },
  );
}

export async function generateQuestionPaper(config: {
  board: string;
  subject: string;
  chapters: string[];
  totalMarks: number;
  duration?: number;
  customInstructions?: string;
}) {
  try {
    const prompt = `Generate a ${config.board} ${config.subject} question paper.

Chapters/Topics: ${config.chapters.join(', ')}
Total Marks: ${config.totalMarks}
Duration: ${config.duration || 180} minutes
${config.customInstructions ? `Specific Instructions/Topics: ${config.customInstructions}` : ''}

Return only a JSON object in this shape:
{"header":{"title":"...","board":"...","subject":"...","totalMarks":100},"sections":[{"title":"...","marks":20,"questions":["..."]}]}`;

    const response = await callAI(prompt, true);
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Paper Error:', error);
    return {
      header: {
        title: config.customInstructions || `${config.subject} Question Paper`,
        board: config.board,
        subject: config.subject,
        totalMarks: config.totalMarks,
      },
      sections: [
        {
          title: 'Section A - Standard Questions',
          marks: Math.round(config.totalMarks / (config.chapters.length || 1)),
          questions: config.chapters.length > 0 
            ? config.chapters.map((chapter) => `Analyze the core principles and applications of ${chapter} within the context of ${config.subject}.`)
            : [`Develop a detailed response regarding the topic: ${config.customInstructions || config.subject}.`]
        },
      ],
    };
  }
}

export async function generateStudyGuide(topic: string, subject: string, focusAreas?: string[]) {
  try {
    const prompt = `Create a study guide for "${topic}" in "${subject}".
${focusAreas?.length ? `Focus on: ${focusAreas.join(', ')}` : ''}

Include overview, key points, common mistakes, practice tips, and resources.
Use Markdown format.`;

    return cleanAIOutput(await callAI(prompt));
  } catch (error) {
    console.error('Study Guide Error:', error);
    return cleanAIOutput(`# Study Guide: ${topic}

## Overview
Understand the fundamentals of ${topic} in ${subject}.

## Key Points
- Review the definition.
- Practice examples.
- Track common mistakes.

## Practice Tips
- Revise regularly.
- Attempt mixed questions.
- Explain the concept in your own words.`);
  }
}

export async function generateQuickRevision(topic: string): Promise<string> {
  try {
    const prompt = `Create a 2-minute quick revision summary for "${topic}". Use bullet points, formulas, and key concepts only. Keep it under 500 words.`;
    return cleanAIOutput(await callAI(prompt));
  } catch (error) {
    console.error('Quick Revision Error:', error);
    return cleanAIOutput(`## Quick Revision: ${topic}

- Review the key definition.
- Memorize important formulas or rules.
- Practice one solved example.
- Recheck common mistakes.`);
  }
}

export async function generateConceptExplanation(
  concept: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
): Promise<string> {
  try {
    const prompt = `Explain "${concept}" at a ${difficulty} level.

Include:
- Definition
- Example
- Why it matters
- Common misconceptions`;

    return cleanAIOutput(await callAI(prompt));
  } catch (error) {
    console.error('Concept Error:', error);
    return cleanAIOutput(`## ${concept}

This concept is important because it connects theory with exam-style problem solving. Start with the definition, work through an example, and then practice similar questions.`);
  }
}

export async function generateAssessmentFeedback(
  studentResponse: string,
  correctAnswer: string,
  topic: string,
): Promise<string> {
  try {
    const prompt = `Provide constructive feedback on this answer.

Topic: ${topic}
Student answer: "${studentResponse}"
Correct answer: "${correctAnswer}"

Include what they got right, what to improve, and tips for mastery.`;

    return cleanAIOutput(await callAI(prompt));
  } catch (error) {
    console.error('Feedback Error:', error);
    return cleanAIOutput('Good attempt. Review the correct answer, identify the missing step, and practice two similar questions to improve.');
  }
}
