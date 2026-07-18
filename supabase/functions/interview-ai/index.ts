import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callAI(messages: any[]) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
      tools: [{
        type: "function",
        function: {
          name: "structured_response",
          description: "Return structured data",
          parameters: {
            type: "object",
            properties: {
              result: { type: "object" }
            },
            required: ["result"],
          }
        }
      }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("AI gateway error:", response.status, text);
    if (response.status === 429) throw new Error("Rate limited. Please try again later.");
    if (response.status === 402) throw new Error("Credits exhausted. Please add funds.");
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();
  
  // Try to get tool call result first
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) {
    try {
      const parsed = JSON.parse(toolCall.function.arguments);
      return parsed.result || parsed;
    } catch {}
  }
  
  // Fallback to content parsing
  const content = data.choices?.[0]?.message?.content || "";
  try {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  } catch {}
  
  return { text: content };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, resumeText, interviewType, question, answer, results } = await req.json();

    let responseData;

    switch (action) {
      case "analyze-resume": {
        responseData = await callAI([
          {
            role: "system",
            content: `You are a career coach AI. Analyze the resume and create a personalized learning plan.
Return JSON with: { "result": { "learningPlan": "markdown string with sections for: Key Strengths, Areas to Improve, Recommended Study Topics, Practice Resources, 30-Day Action Plan" } }`
          },
          { role: "user", content: `Analyze this resume and create a personalized interview preparation learning plan:\n\n${resumeText}` }
        ]);
        break;
      }

      case "generate-questions": {
        const type = interviewType === "technical" ? "technical coding and system design" : "behavioral and HR";
        responseData = await callAI([
          {
            role: "system",
            content: `You are an expert interviewer. Generate exactly 5 ${type} interview questions tailored to the candidate's resume.
Return JSON: { "result": { "questions": ["q1", "q2", "q3", "q4", "q5"] } }`
          },
          { role: "user", content: `Based on this resume, generate 5 ${type} interview questions:\n\n${resumeText}` }
        ]);
        break;
      }

      case "evaluate-answer": {
        responseData = await callAI([
          {
            role: "system",
            content: `You are an interview evaluator. Score the answer on multiple dimensions.
Return JSON: { "result": { "score": 0-100, "grammarScore": 0-100, "accuracyScore": 0-100, "clarityScore": 0-100, "feedback": "detailed feedback string" } }`
          },
          {
            role: "user",
            content: `Interview type: ${interviewType}\nQuestion: ${question}\nCandidate's answer: ${answer}\n\nResume context: ${resumeText?.slice(0, 500)}\n\nEvaluate this answer.`
          }
        ]);
        break;
      }

      case "overall-feedback": {
        responseData = await callAI([
          {
            role: "system",
            content: `You are a senior interviewer providing overall feedback after an interview.
Return JSON: { "result": { "overallScore": 0-100, "overallFeedback": "markdown string with: Performance Summary, Top Strengths, Key Improvement Areas, Specific Recommendations, Next Steps" } }`
          },
          {
            role: "user",
            content: `Interview type: ${interviewType}\nResults: ${JSON.stringify(results)}\nResume: ${resumeText?.slice(0, 500)}\n\nProvide comprehensive overall feedback.`
          }
        ]);
        break;
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("interview-ai error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    const status = msg.includes("Rate limited") ? 429 : msg.includes("Credits") ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
