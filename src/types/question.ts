import { Option } from "./option";

export interface Question {
   id: string;
   content: string;
   type: string;
   options: Option[];
}
