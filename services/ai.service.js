
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates an AI-based intent score and reasoning for a lead.
 * @param {object} lead The lead object.
 * @param {object} offer The offer object.
 * @returns {object} An object containing { intent, reasoning, ai_score }.
 */
const getAiIntent = async (lead, offer) => {
    try {
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert B2B sales development representative. Your task is to analyze a prospect's profile against a product offer and classify their buying intent.

            **Product/Offer Information:**
            - Product Name: "${offer.name}"
            - Key Value Propositions: ${offer.value_props.join(', ')}
            - Ideal Customer Profile / Use Cases: ${offer.ideal_use_cases.join(', ')}

            **Prospect Information:**
            - Name: ${lead.name}
            - Role: "${lead.role}"
            - Company: ${lead.company}
            - Industry: ${lead.industry}
            - LinkedIn Bio: "${lead.linkedin_bio}"

            Based on this, classify the prospect's buying intent as "High", "Medium", or "Low". Provide a concise, one-sentence explanation for your classification.
            Return your answer ONLY as a valid JSON object with the keys "intent" and "reasoning".
            Example: {"intent": "High", "reasoning": "As the Head of Growth in a mid-market SaaS company, this prospect is a key decision-maker within the ideal customer profile."}
        `;

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

      
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiResult = JSON.parse(cleanedText);

        const intentMapping = {
            "High": 50,
            "Medium": 30,
            "Low": 10
        };

        return {
            intent: aiResult.intent || 'Low',
            reasoning: aiResult.reasoning || 'AI could not determine intent.',
            ai_score: intentMapping[aiResult.intent] || 10,
        };
    } catch (error) {
        console.error("Error with AI Service:", error);
       
        return {
            intent: 'Low',
            reasoning: 'AI analysis failed. Defaulting to Low intent.',
            ai_score: 10,
        };
    }
};

module.exports = { getAiIntent };