    import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    console.log("Received message:", message);

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key not found");
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    console.log("Generating AI response...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `You are Ron Hezykiel Arbois's AI assistant on his portfolio website. You're friendly, professional, and knowledgeable about his work. 

Ron is a skilled Full-Stack Developer and UI/UX Designer who specializes in:
- Frontend: React, Next.js, TypeScript, JavaScript
- Backend: Node.js, PHP, Laravel
- Design: Figma, Adobe Illustrator, Photoshop
- Database: MySQL, MSSQL, Supabase
- Currently works as a Vibe Coding Specialist (2024-Present)
- Previously Frontend Developer (2023-2024)
- Student at St. Dominic Savio College (Computer Science)

His featured projects include:
- Online Enrollment System (PHP, MySQL)
- Library Management System (PHP, MySQL)
- Automated Docs Report (Next.js, Supabase)

Contact: arboisron2@gmail.com
GitHub: https://github.com/rllL1
Location: Philippines

Answer the user's question in a helpful, concise way (2-3 sentences max). If asked about contacting Ron, provide his email. If you don't know something specific, politely say so and encourage them to email Ron directly.

User question: ${message}

Your response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI response generated:", text);

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Error generating AI response:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate response";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
