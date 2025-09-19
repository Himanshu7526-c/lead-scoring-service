// services/scoring.service.js

/**
 * Calculates a score based on predefined rules.
 * @param {object} lead The lead object.
 * @param {object} offer The offer object.
 * @returns {number} The calculated rule-based score.
 */
const calculateRuleScore = (lead) => {
    let score = 0;

    // Rule 1: Role Relevance (Max 20 points)
    const role = lead.role.toLowerCase();
    const decisionMakerKeywords = ['head', 'vp', 'director', 'manager', 'founder', 'ceo', 'c-level'];
    const influencerKeywords = ['senior', 'lead', 'principal'];

    if (decisionMakerKeywords.some(kw => role.includes(kw))) {
        score += 20;
    } else if (influencerKeywords.some(kw => role.includes(kw))) {
        score += 10;
    }

    // Rule 2: Industry Match (Max 20 points)
    // This is a simplified example. A real app might use the offer's ICP.
    const leadIndustry = lead.industry.toLowerCase();
    const idealIndustries = ['saas', 'software', 'technology', 'b2b'];
    const adjacentIndustries = ['marketing', 'e-commerce', 'fintech'];

    if (idealIndustries.some(i => leadIndustry.includes(i))) {
        score += 20;
    } else if (adjacentIndustries.some(i => leadIndustry.includes(i))) {
        score += 10;
    }
    
    // Rule 3: Data Completeness (Max 10 points)
    if (lead.name && lead.role && lead.company && lead.industry && lead.location && lead.linkedin_bio) {
        score += 10;
    }

    return score;
};

module.exports = { calculateRuleScore };