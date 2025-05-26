// components/ui/questionDialog.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type QuestionDialogProps = {
   open: boolean;
   onClose: () => void;
   quizId: string;
};

export function QuestionDialog({ open, onClose, quizId }: QuestionDialogProps) {
   const [questionContent, setQuestionContent] = useState("");
   const [options, setOptions] = useState([
      { content: "", isCorrect: true },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
   ]);
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const handleAddOption = () => {
      setOptions([...options, { content: "", isCorrect: false }]);
   };

   const handleOptionChange = (index: number, field: "content" | "isCorrect", value: string | boolean) => {
      const updatedOptions = [...options];

      if (field === "content") {
         updatedOptions[index].content = value as string;
      } else if (field === "isCorrect") {
         // Jika opsi ini diatur sebagai benar, atur semua opsi lain menjadi salah
         if (value === true) {
            updatedOptions.forEach((option, i) => {
               option.isCorrect = i === index;
            });
         } else {
            updatedOptions[index].isCorrect = value as boolean;
         }
      }

      setOptions(updatedOptions);
   };

   const handleCreateQuestion = async () => {
      if (!questionContent.trim()) {
         alert("Pertanyaan tidak boleh kosong!");
         return;
      }

      // Pastikan setidaknya ada satu opsi benar
      const hasCorrectOption = options.some(option => option.isCorrect);
      if (!hasCorrectOption) {
         alert("Harus ada minimal satu opsi jawaban yang benar!");
         return;
      }

      // Validasi opsi tidak kosong
      const emptyOptions = options.filter(option => !option.content.trim());
      if (emptyOptions.length > 0) {
         alert("Semua opsi jawaban harus diisi!");
         return;
      }

      setIsLoading(true);

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

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || "Gagal membuat pertanyaan");
         }

         alert("Pertanyaan berhasil dibuat!");
         setQuestionContent("");
         setOptions([
            { content: "", isCorrect: true },
            { content: "", isCorrect: false },
            { content: "", isCorrect: false },
            { content: "", isCorrect: false },
         ]);
         onClose();

         // Refresh halaman untuk menampilkan pertanyaan baru
         router.refresh();
      } catch (error) {
         console.error(error);
         alert("Terjadi kesalahan saat membuat pertanyaan.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Buat Pertanyaan Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Isi Pertanyaan</label>
                  <Input
                     placeholder="Tulis pertanyaan di sini"
                     value={questionContent}
                     onChange={(e) => setQuestionContent(e.target.value)}
                     disabled={isLoading}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Opsi Jawaban</label>
                  <p className="text-xs text-gray-500">Pilih satu opsi sebagai jawaban yang benar</p>

                  {options.map((option, index) => (
                     <div key={index} className="flex items-center space-x-2">
                        <Input
                           placeholder={`Opsi ${index + 1}`}
                           value={option.content}
                           onChange={(e) => handleOptionChange(index, "content", e.target.value)}
                           disabled={isLoading}
                           className="flex-1"
                        />
                        <label className="flex items-center space-x-1 cursor-pointer">
                           <input
                              type="radio"
                              name="correctOption"
                              checked={option.isCorrect}
                              onChange={() => handleOptionChange(index, "isCorrect", true)}
                              disabled={isLoading}
                           />
                           <span className="text-sm">Benar</span>
                        </label>
                     </div>
                  ))}

                  {options.length < 6 && (
                     <Button
                        onClick={handleAddOption}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                     >
                        Tambah Opsi
                     </Button>
                  )}
               </div>

               <Button
                  onClick={handleCreateQuestion}
                  disabled={isLoading}
                  className="w-full"
               >
                  {isLoading ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Membuat...
                     </>
                  ) : (
                     "Buat Pertanyaan"
                  )}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}