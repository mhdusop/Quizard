import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type QuestionDialogProps = {
   open: boolean;
   onClose: () => void;
   quizId: string;
};

export function QuestionDialog({ open, onClose, quizId }: QuestionDialogProps) {
   const [questionContent, setQuestionContent] = useState("");
   const [options, setOptions] = useState([{ content: "", isCorrect: false }]);

   const handleAddOption = () => {
      setOptions([...options, { content: "", isCorrect: false }]);
   };

   const handleOptionChange = (index: number, field: "content" | "isCorrect", value: string | boolean) => {
      const updatedOptions = [...options];
      if (field === "content") {
         updatedOptions[index].content = value as string;
      } else if (field === "isCorrect") {
         updatedOptions[index].isCorrect = value as boolean;
      }
      setOptions(updatedOptions);
   };

   const handleCreateQuestion = async () => {
      try {
         const response = await fetch("/api/questions", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               quizId,
               content: questionContent,
               options,
            }),
         });

         if (response.ok) {
            alert("Pertanyaan berhasil dibuat!");
            onClose();
         } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
         }
      } catch (error) {
         console.error("Error creating question:", error);
         alert("Terjadi kesalahan saat membuat pertanyaan.");
      }
   };

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Buat Pertanyaan Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
               <Input
                  placeholder="Isi Pertanyaan"
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
               />
               {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                     <Input
                        placeholder={`Opsi ${index + 1}`}
                        value={option.content}
                        onChange={(e) => handleOptionChange(index, "content", e.target.value)}
                     />
                     <label>
                        <input
                           type="checkbox"
                           checked={option.isCorrect}
                           onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                        />
                        Benar
                     </label>
                  </div>
               ))}
               <Button onClick={handleAddOption}>Tambah Opsi</Button>
               <Button onClick={handleCreateQuestion}>Buat Pertanyaan</Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}