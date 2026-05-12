import { cleanAIOutput } from '../utils/helpers';

const API_KEY = (import.meta as any).env.VITE_AI_API_KEY || '';
const MODEL = (import.meta as any).env.VITE_AI_MODEL || 'qwen/qwen-2.5-coder-32b';
const BASE_URL = (import.meta as any).env.VITE_AI_BASE_URL || 'https://integrate.api.nvidia.com/v1';

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
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: isExpertMode 
              ? NCERT_SYSTEM_PROMPT 
              : (jsonMode
                ? 'Return only valid JSON. Do not include markdown fences or commentary.'
                : 'You are an expert educational assistant helping students learn effectively.'),
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    const text = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

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
      const backendResponse = await fetch('http://localhost:5000/api/ncert-search', {
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
    console.error('AI Lesson Error:', error);
    return cleanAIOutput(`## ${topic} - ${subject}

### Introduction
${topic} is an important concept in ${subject}. Start by understanding the definition, then connect it to examples and practice questions.

### Core Concepts
- Learn the basic definition.
- Identify the key formula, rule, or idea.
- Connect the topic to real exam-style questions.

### Tips
- Revise the concept in small chunks.
- Practice one solved example before attempting new questions.
- Note mistakes and convert them into revision points.

*Note: Full AI content could not be loaded. Check your API key or internet connection.*`);
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
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Question Error:', error);
    return [
      {
        question: `What is the main concept of ${topic} in ${subject}?`,
        options: ['Fundamental principle', 'Advanced theory', 'Practical application', 'Historical context'],
        correctIndex: 0,
        explanation: 'This checks whether you understand the foundation before moving into applications.',
      },
    ];
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
