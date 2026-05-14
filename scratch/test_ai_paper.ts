import { generateQuestionPaper } from '../src/services/ai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const paper = await generateQuestionPaper({
      board: 'CBSE',
      subject: 'Science',
      chapters: ['Light', 'Electricity'],
      totalMarks: 80,
      duration: 180
    });
    console.log(JSON.stringify(paper, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
