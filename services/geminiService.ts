
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_INVOICES } from "../lib/mockData";
import { format, subMonths } from 'date-fns';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const INVOICE_TABLE_SCHEMA = `
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT,
    vendor_name TEXT,
    amount REAL,
    due_date TEXT, -- Format YYYY-MM-DD
    processed_date TEXT, -- Format YYYY-MM-DD
    category TEXT,
    status TEXT -- 'paid', 'pending', or 'not paid'
);
`;

const SYSTEM_INSTRUCTION = `You are an expert SQLite assistant. Your task is to process a user's question about their invoice data and respond in a specific JSON format.

The database contains one table with the following schema:
${INVOICE_TABLE_SCHEMA}

- Today's date is ${format(new Date(), 'yyyy-MM-dd')}.
- One month ago was ${format(subMonths(new Date(), 1), 'yyyy-MM-dd')}.
- Dates can be compared directly, e.g., 'processed_date' > '${format(subMonths(new Date(), 1), 'yyyy-MM-dd')}'.

Based on the user's prompt, you must decide whether to generate a SQL query or provide a conversational text response.

Your entire response MUST be a single, valid JSON object with the following structure:
{
  "type": "sql" | "text",
  "content": "..."
}

- If the user's question can be answered with a SQL query, set "type" to "sql" and "content" to the complete, syntactically correct SQLite query.
- If the user's question is a greeting, a question that cannot be answered from the schema (e.g., "what's the weather?"), or is otherwise conversational, set "type" to "text" and "content" to a friendly, helpful message.

Examples:
User: "hi" -> {"type": "text", "content": "Hello! How can I help you analyze your invoices today?"}
User: "top 5 vendors by spend" -> {"type": "sql", "content": "SELECT vendor_name, SUM(amount) as total_spend FROM invoices GROUP BY vendor_name ORDER BY total_spend DESC LIMIT 5;"}
User: "total spend last month" -> {"type": "sql", "content": "SELECT SUM(amount) FROM invoices WHERE processed_date >= '${format(subMonths(new Date(), 1), 'yyyy-MM-dd')}';"
`;

// This is a mock query executor. In a real app, this would run on a backend.
const executeMockQuery = (sql: string): Record<string, any>[] => {
  // A very basic mock using regex to parse the query.
  // This is NOT a real SQL parser and is for demonstration only.
  const lowerSql = sql.toLowerCase();
  
  if (lowerSql.includes('sum(amount)')) {
    let invoicesToSum = MOCK_INVOICES;
    if (lowerSql.includes("where processed_date >=")) {
        invoicesToSum = MOCK_INVOICES.filter(i => new Date(i.processed_date) >= subMonths(new Date(), 1));
    }
    const total = invoicesToSum.reduce((acc, inv) => acc + inv.amount, 0);
    return [{ 'SUM(amount)': total }];
  }
  
  if (lowerSql.includes('group by vendor_name')) {
    const spendByVendor = MOCK_INVOICES.reduce((acc, inv) => {
      acc[inv.vendor.name] = (acc[inv.vendor.name] || 0) + inv.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(spendByVendor)
      .map(([name, total]) => ({ vendor_name: name, total_spend: total }))
      .sort((a, b) => b.total_spend - a.total_spend)
      .slice(0, 5);
  }

  if (lowerSql.includes('status = \'not paid\'')) {
      return MOCK_INVOICES.filter(i => i.status === 'not paid').slice(0, 10).map(i => ({
          invoice_number: i.invoice_number,
          vendor_name: i.vendor.name,
          amount: i.amount,
          due_date: i.due_date
      }));
  }
  
  // Default fallback for simple selects
  return MOCK_INVOICES.slice(0, 10).map(inv => ({
    invoice_number: inv.invoice_number,
    vendor_name: inv.vendor.name,
    amount: inv.amount,
    status: inv.status
  }));
};

export const generateSqlAndData = async (prompt: string): Promise<{ sql: string, result: Record<string, any>[], responseText?: string }> => {
  let rawResponseText = '';
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: "Should be 'sql' if the user's query can be answered with a SQL query, otherwise 'text'."
            },
            content: {
              type: Type.STRING,
              description: "The SQL query or the text response."
            }
          },
          required: ['type', 'content']
        }
      }
    });

    if (!response.text) {
      throw new Error("The AI model did not provide a response. This might be due to content safety filters. Please try a different query.");
    }

    rawResponseText = response.text.trim();
    const parsedResponse = JSON.parse(rawResponseText);

    if (typeof parsedResponse !== 'object' || parsedResponse === null || !('type' in parsedResponse) || !('content' in parsedResponse)) {
      throw new Error("The AI returned a response with an unexpected format. Please try again.");
    }

    if (parsedResponse.type === 'text') {
      return { sql: 'N/A', result: [], responseText: parsedResponse.content };
    }

    if (parsedResponse.type === 'sql') {
      const sqlQuery = parsedResponse.content;
      if (!sqlQuery || sqlQuery.trim() === '') {
         return { sql: 'N/A', result: [], responseText: "I was unable to generate a SQL query for that request. Could you try rephrasing it?" };
      }
      const result = executeMockQuery(sqlQuery);
      return { sql: sqlQuery, result, responseText: undefined };
    }

    throw new Error("The AI returned an unknown response type. Please try again.");

  } catch (error: any) {
    console.error("Error in generateSqlAndData:", error);

    if (error instanceof SyntaxError) {
      console.error("Raw AI response text that failed to parse:", rawResponseText);
      throw new Error("I received a malformed response from the AI. Could you please try rephrasing your question?");
    }
    
    if (error.message.includes('API key not valid')) {
        throw new Error("The AI service is not configured correctly. Please check the API key.");
    }

    // Pass through custom error messages we've already defined.
    if (error.message.startsWith("The AI")) {
        throw error;
    }
    
    throw new Error("I'm having trouble connecting to the AI service. Please try again in a moment.");
  }
};
