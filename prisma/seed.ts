import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
   try {
      console.log("🌱 Starting database seeding...");

      // Clean up the existing database - CAREFUL with this in production!
      await cleanDatabase();

      // Create users - 1 admin, 1 normal user
      const adminUser = await createAdminUser();
      const regularUser = await createRegularUser();

      // Create sample quizzes
      await createMathQuiz(adminUser.id);
      await createScienceQuiz(adminUser.id);
      await createHistoryQuiz(adminUser.id);
      await createGeographyQuiz(adminUser.id);
      await createLiteratureQuiz(regularUser.id);

      console.log("✅ Database has been seeded successfully!");
   } catch (error) {
      console.error("❌ Error seeding the database:", error);
      throw error;
   } finally {
      await prisma.$disconnect();
   }
}

async function cleanDatabase() {
   // Delete everything in a safe order to respect foreign key constraints
   await prisma.answer.deleteMany();
   await prisma.quizAttempt.deleteMany();
   await prisma.option.deleteMany();
   await prisma.question.deleteMany();
   await prisma.quiz.deleteMany();
   // Don't delete users for the moment if you want to keep existing ones
   // Uncomment the following if you want to completely reset users too
   // await prisma.account.deleteMany();
   // await prisma.session.deleteMany();
   // await prisma.user.deleteMany();

   console.log("🧹 Database cleaned successfully");
}

async function createAdminUser() {
   const hashedPassword = await bcrypt.hash("admin123", 10);

   const user = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
         name: "Admin User",
         email: "admin@example.com",
         password: hashedPassword,
         role: Role.ADMIN,
      },
   });

   console.log("👤 Created admin user:", user.email);
   return user;
}

async function createRegularUser() {
   const hashedPassword = await bcrypt.hash("user123", 10);

   const user = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
         name: "Regular User",
         email: "user@example.com",
         password: hashedPassword,
         role: Role.USER,
      },
   });

   console.log("👤 Created regular user:", user.email);
   return user;
}

async function createMathQuiz(creatorId: string) {
   const quiz = await prisma.quiz.create({
      data: {
         title: "Basic Mathematics Quiz",
         description: "Test your knowledge of fundamental math concepts",
         timeLimit: 600, // 10 minutes
         userId: creatorId,
      },
   });

   // Questions for math quiz
   const questions = [
      {
         content: "What is the result of 7 × 8?",
         options: [
            { content: "54", isCorrect: false },
            { content: "56", isCorrect: true },
            { content: "58", isCorrect: false },
            { content: "64", isCorrect: false },
         ],
      },
      {
         content: "Solve for x: 2x + 5 = 13",
         options: [
            { content: "x = 4", isCorrect: true },
            { content: "x = 5", isCorrect: false },
            { content: "x = 6", isCorrect: false },
            { content: "x = 8", isCorrect: false },
         ],
      },
      {
         content: "What is the square root of 81?",
         options: [
            { content: "7", isCorrect: false },
            { content: "8", isCorrect: false },
            { content: "9", isCorrect: true },
            { content: "10", isCorrect: false },
         ],
      },
      {
         content:
            "If a triangle has angles measuring 30°, 60°, and 90°, what type of triangle is it?",
         options: [
            { content: "Equilateral", isCorrect: false },
            { content: "Isosceles", isCorrect: false },
            { content: "Scalene", isCorrect: false },
            { content: "Right-angled", isCorrect: true },
         ],
      },
      {
         content:
            "What is the area of a rectangle with length 8 cm and width 5 cm?",
         options: [
            { content: "13 cm²", isCorrect: false },
            { content: "26 cm²", isCorrect: false },
            { content: "40 cm²", isCorrect: true },
            { content: "45 cm²", isCorrect: false },
         ],
      },
      {
         content: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
         options: [
            { content: "24", isCorrect: false },
            { content: "32", isCorrect: true },
            { content: "30", isCorrect: false },
            { content: "20", isCorrect: false },
         ],
      },
      {
         content: "What is the value of π (pi) rounded to two decimal places?",
         options: [
            { content: "3.14", isCorrect: true },
            { content: "3.41", isCorrect: false },
            { content: "3.12", isCorrect: false },
            { content: "3.16", isCorrect: false },
         ],
      },
   ];

   for (const question of questions) {
      await createQuestion(
         quiz.id,
         question.content,
         "multiple-choice",
         question.options
      );
   }

   console.log("📚 Created Math quiz with 7 questions");
   return quiz;
}

async function createScienceQuiz(creatorId: string) {
   const quiz = await prisma.quiz.create({
      data: {
         title: "General Science Knowledge",
         description: "Test your understanding of basic scientific concepts",
         timeLimit: 480, // 8 minutes
         userId: creatorId,
      },
   });

   // Questions for science quiz
   const questions = [
      {
         content: "What is the chemical symbol for gold?",
         options: [
            { content: "Go", isCorrect: false },
            { content: "Ag", isCorrect: false },
            { content: "Au", isCorrect: true },
            { content: "Gd", isCorrect: false },
         ],
      },
      {
         content: "What force keeps planets in orbit around the Sun?",
         options: [
            { content: "Electromagnetic force", isCorrect: false },
            { content: "Nuclear force", isCorrect: false },
            { content: "Gravity", isCorrect: true },
            { content: "Friction", isCorrect: false },
         ],
      },
      {
         content: "Which of the following is NOT a state of matter?",
         options: [
            { content: "Solid", isCorrect: false },
            { content: "Liquid", isCorrect: false },
            { content: "Gas", isCorrect: false },
            { content: "Energy", isCorrect: true },
         ],
      },
      {
         content: "What is the largest organ in the human body?",
         options: [
            { content: "Heart", isCorrect: false },
            { content: "Liver", isCorrect: false },
            { content: "Skin", isCorrect: true },
            { content: "Brain", isCorrect: false },
         ],
      },
      {
         content: "Which planet is known as the Red Planet?",
         options: [
            { content: "Venus", isCorrect: false },
            { content: "Mars", isCorrect: true },
            { content: "Jupiter", isCorrect: false },
            { content: "Saturn", isCorrect: false },
         ],
      },
      {
         content: "What is the process by which plants make their own food?",
         options: [
            { content: "Respiration", isCorrect: false },
            { content: "Fermentation", isCorrect: false },
            { content: "Photosynthesis", isCorrect: true },
            { content: "Digestion", isCorrect: false },
         ],
      },
   ];

   for (const question of questions) {
      await createQuestion(
         quiz.id,
         question.content,
         "multiple-choice",
         question.options
      );
   }

   console.log("📚 Created Science quiz with 6 questions");
   return quiz;
}

async function createHistoryQuiz(creatorId: string) {
   const quiz = await prisma.quiz.create({
      data: {
         title: "World History Challenge",
         description: "Test your knowledge of important historical events",
         timeLimit: 720, // 12 minutes
         userId: creatorId,
      },
   });

   // Questions for history quiz
   const questions = [
      {
         content: "In which year did World War II end?",
         options: [
            { content: "1943", isCorrect: false },
            { content: "1945", isCorrect: true },
            { content: "1947", isCorrect: false },
            { content: "1950", isCorrect: false },
         ],
      },
      {
         content: "Who was the first President of the United States?",
         options: [
            { content: "Thomas Jefferson", isCorrect: false },
            { content: "John Adams", isCorrect: false },
            { content: "George Washington", isCorrect: true },
            { content: "Abraham Lincoln", isCorrect: false },
         ],
      },
      {
         content: "Which ancient civilization built the Machu Picchu?",
         options: [
            { content: "Aztecs", isCorrect: false },
            { content: "Mayans", isCorrect: false },
            { content: "Incas", isCorrect: true },
            { content: "Olmecs", isCorrect: false },
         ],
      },
      {
         content: "The French Revolution began in which year?",
         options: [
            { content: "1789", isCorrect: true },
            { content: "1776", isCorrect: false },
            { content: "1798", isCorrect: false },
            { content: "1804", isCorrect: false },
         ],
      },
      {
         content: "Who was the first woman to win a Nobel Prize?",
         options: [
            { content: "Marie Curie", isCorrect: true },
            { content: "Rosa Parks", isCorrect: false },
            { content: "Florence Nightingale", isCorrect: false },
            { content: "Mother Teresa", isCorrect: false },
         ],
      },
      {
         content:
            "The Great Wall of China was built primarily to defend against which group?",
         options: [
            { content: "Mongols", isCorrect: true },
            { content: "Japanese", isCorrect: false },
            { content: "Russians", isCorrect: false },
            { content: "Koreans", isCorrect: false },
         ],
      },
      {
         content: "Which event is considered the start of World War I?",
         options: [
            { content: "Invasion of Poland", isCorrect: false },
            { content: "Sinking of the Lusitania", isCorrect: false },
            {
               content: "Assassination of Archduke Franz Ferdinand",
               isCorrect: true,
            },
            { content: "Treaty of Versailles", isCorrect: false },
         ],
      },
      {
         content: "Who painted the Mona Lisa?",
         options: [
            { content: "Michelangelo", isCorrect: false },
            { content: "Vincent van Gogh", isCorrect: false },
            { content: "Pablo Picasso", isCorrect: false },
            { content: "Leonardo da Vinci", isCorrect: true },
         ],
      },
   ];

   for (const question of questions) {
      await createQuestion(
         quiz.id,
         question.content,
         "multiple-choice",
         question.options
      );
   }

   console.log("📚 Created History quiz with 8 questions");
   return quiz;
}

async function createGeographyQuiz(creatorId: string) {
   const quiz = await prisma.quiz.create({
      data: {
         title: "World Geography",
         description:
            "Test your knowledge about countries, capitals, and landmarks",
         timeLimit: 540, // 9 minutes
         userId: creatorId,
      },
   });

   // Questions for geography quiz
   const questions = [
      {
         content: "What is the capital city of Australia?",
         options: [
            { content: "Sydney", isCorrect: false },
            { content: "Melbourne", isCorrect: false },
            { content: "Canberra", isCorrect: true },
            { content: "Perth", isCorrect: false },
         ],
      },
      {
         content: "Which mountain is the tallest in the world?",
         options: [
            { content: "K2", isCorrect: false },
            { content: "Mount Everest", isCorrect: true },
            { content: "Kangchenjunga", isCorrect: false },
            { content: "Mount Kilimanjaro", isCorrect: false },
         ],
      },
      {
         content: "Which country has the largest population in the world?",
         options: [
            { content: "India", isCorrect: false },
            { content: "United States", isCorrect: false },
            { content: "China", isCorrect: true },
            { content: "Indonesia", isCorrect: false },
         ],
      },
      {
         content: "The Amazon River is located primarily in which country?",
         options: [
            { content: "Colombia", isCorrect: false },
            { content: "Peru", isCorrect: false },
            { content: "Venezuela", isCorrect: false },
            { content: "Brazil", isCorrect: true },
         ],
      },
      {
         content: "What is the largest desert in the world?",
         options: [
            { content: "Gobi Desert", isCorrect: false },
            { content: "Sahara Desert", isCorrect: false },
            { content: "Antarctic Desert", isCorrect: true },
            { content: "Arabian Desert", isCorrect: false },
         ],
      },
      {
         content: "Which canal connects the Mediterranean Sea to the Red Sea?",
         options: [
            { content: "Panama Canal", isCorrect: false },
            { content: "Suez Canal", isCorrect: true },
            { content: "Kiel Canal", isCorrect: false },
            { content: "Grand Canal", isCorrect: false },
         ],
      },
      {
         content: "Which of these countries is NOT in Europe?",
         options: [
            { content: "Portugal", isCorrect: false },
            { content: "Romania", isCorrect: false },
            { content: "Turkey", isCorrect: true },
            { content: "Finland", isCorrect: false },
         ],
      },
      {
         content: "What is the largest island in the world?",
         options: [
            { content: "Borneo", isCorrect: false },
            { content: "Madagascar", isCorrect: false },
            { content: "Greenland", isCorrect: true },
            { content: "New Guinea", isCorrect: false },
         ],
      },
      {
         content: "Which ocean is the largest by area?",
         options: [
            { content: "Atlantic Ocean", isCorrect: false },
            { content: "Indian Ocean", isCorrect: false },
            { content: "Southern Ocean", isCorrect: false },
            { content: "Pacific Ocean", isCorrect: true },
         ],
      },
   ];

   for (const question of questions) {
      await createQuestion(
         quiz.id,
         question.content,
         "multiple-choice",
         question.options
      );
   }

   console.log("📚 Created Geography quiz with 9 questions");
   return quiz;
}

async function createLiteratureQuiz(creatorId: string) {
   const quiz = await prisma.quiz.create({
      data: {
         title: "Literature Classics",
         description:
            "Test your knowledge of famous works of literature and their authors",
         timeLimit: 600, // 10 minutes
         userId: creatorId,
      },
   });

   // Questions for literature quiz
   const questions = [
      {
         content: "Who wrote 'Pride and Prejudice'?",
         options: [
            { content: "Charlotte Brontë", isCorrect: false },
            { content: "Jane Austen", isCorrect: true },
            { content: "Emily Brontë", isCorrect: false },
            { content: "Virginia Woolf", isCorrect: false },
         ],
      },
      {
         content: "Which of these is NOT a play by William Shakespeare?",
         options: [
            { content: "Hamlet", isCorrect: false },
            { content: "Macbeth", isCorrect: false },
            { content: "Moby Dick", isCorrect: true },
            { content: "Romeo and Juliet", isCorrect: false },
         ],
      },
      {
         content: "Who wrote the novel '1984'?",
         options: [
            { content: "George Orwell", isCorrect: true },
            { content: "Aldous Huxley", isCorrect: false },
            { content: "Ray Bradbury", isCorrect: false },
            { content: "J.G. Ballard", isCorrect: false },
         ],
      },
      {
         content:
            "Which novel begins with the line 'It was the best of times, it was the worst of times'?",
         options: [
            { content: "Oliver Twist", isCorrect: false },
            { content: "Great Expectations", isCorrect: false },
            { content: "A Tale of Two Cities", isCorrect: true },
            { content: "David Copperfield", isCorrect: false },
         ],
      },
      {
         content: "Who is the author of 'The Great Gatsby'?",
         options: [
            { content: "Ernest Hemingway", isCorrect: false },
            { content: "F. Scott Fitzgerald", isCorrect: true },
            { content: "John Steinbeck", isCorrect: false },
            { content: "William Faulkner", isCorrect: false },
         ],
      },
      {
         content: "Which of these works was written by Homer?",
         options: [
            { content: "The Republic", isCorrect: false },
            { content: "The Aeneid", isCorrect: false },
            { content: "The Odyssey", isCorrect: true },
            { content: "Metamorphoses", isCorrect: false },
         ],
      },
   ];

   for (const question of questions) {
      await createQuestion(
         quiz.id,
         question.content,
         "multiple-choice",
         question.options
      );
   }

   console.log("📚 Created Literature quiz with 6 questions");
   return quiz;
}

async function createQuestion(
   quizId: string,
   content: string,
   type: string,
   options: { content: string; isCorrect: boolean }[]
) {
   const question = await prisma.question.create({
      data: {
         content,
         type,
         quizId,
      },
   });

   // Create options for this question
   for (const option of options) {
      await prisma.option.create({
         data: {
            content: option.content,
            isCorrect: option.isCorrect,
            questionId: question.id,
         },
      });
   }

   return question;
}

// Execute the main function
main().catch((e) => {
   console.error(e);
   process.exit(1);
});
