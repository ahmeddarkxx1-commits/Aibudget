export async function parseFinancialInput(input: string, botName: string = "CashFlow AI") {
  const geminiKey = process.env.GEMINI_API_KEY;
  
  // prompt construction
  const systemPrompt = `You are ${botName}, a financial assistant. User says: "${input}". 
  Extract: intent (TRANSACTION/SCHEDULE/CHAT), amount (number), type (EXPENSE/INCOME/NONE), description, reply (if CHAT). 
  Return ONLY JSON. Example: {"intent":"TRANSACTION","amount":100,"type":"EXPENSE","description":"lunch"}`;

  try {
    // 1. TRY GEMINI VIA DIRECT REST API (Super Stable)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (e) {
    console.error("Gemini failed, trying manual logic...");
    
    // 2. FALLBACK: SMART MANUAL LOGIC (If AI fails)
    const amountMatch = input.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
    
    if (input.includes("ميعاد") || input.includes("سجل ميعاد") || input.includes("تاسك") || input.includes("مهمة")) {
      return { 
        intent: "SCHEDULE", 
        description: input.replace(/سجل ميعاد|ميعاد|سجل تاسك|تاسك|سجل مهمة|مهمة/g, "").trim(), 
        date: new Date().toISOString() 
      };
    }
    
    if (amount > 0) {
      const isIncome = input.includes("كسبت") || input.includes("جالي") || input.includes("دخل");
      return { 
        intent: "TRANSACTION", 
        amount, 
        type: isIncome ? "INCOME" : "EXPENSE", 
        description: input.replace(/\d+|كسبت|صرفت|جالي/g, "").trim() || "عملية يدوية" 
      };
    }

    return { intent: "CHAT", reply: `معاك يا بطل.. أنا ${botName}. قولي عاوز تسجل ميعاد ولا مبلغ؟` };
  }
}
