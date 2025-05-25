import { Question } from "./question";

export interface Quiz {
   id: string;
   title: string;
   description?: string;
   timeLimit: number;
   questionCount: number;
   questions: Question[];
}
