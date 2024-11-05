// models/Question.ts
export interface Question {
  _id: string; // Assuming this is a string; adjust accordingly
  question: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
}
