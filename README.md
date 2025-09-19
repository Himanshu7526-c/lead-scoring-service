
# AI-Powered Lead Scoring Backend Service

This backend service provides a set of APIs to upload product/offer information and a list of leads, then uses a combination of rule-based logic and AI-powered analysis (via Google Gemini) to score each lead's buying intent.

**Live API Base URL**: https://lead-scoring-service-41vi.onrender.com

---

## Features

- **Offer Management**: API to set the active product/offer context.
- **CSV Lead Upload**: Endpoint to upload leads in a CSV format.
- **Hybrid Scoring Pipeline**:
    - **Rule Layer**: Scores leads based on role, industry, and data completeness.
    - **AI Layer**: Uses Google Gemini to analyze lead data against the offer to determine intent.
- **Result Retrieval**: API to fetch scored leads, sorted by score.
- **CSV Export**: Bonus endpoint to export scored leads as a CSV file.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API (`@google/generative-ai`)
- **File Handling**: Multer, csv-parser

---

## Setup and Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**
    Create a `.env` file in the root directory and add the following variables.

    ```
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4. **Run the Server Locally**
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3000`.

---

## API Usage Examples (cURL)

**Base URL**: Use the live URL above or `http://localhost:3000` for local testing.

### 1. Set Product Offer
```bash
curl -X POST https://your-app-name.onrender.com/api/offer -H "Content-Type: application/json" -d '{
  "name": "AI Outreach Automation Pro",
  "value_props": ["Automates cold outreach 24/7", "Generates 6x more qualified meetings"],
  "ideal_use_cases": ["B2B SaaS companies", "Sales teams"]
}'
```

### 2. Upload Leads CSV
```bash
curl -X POST https://your-app-name.onrender.com/api/leads/upload -F "leads_file=@/path/to/your/leads.csv"
```

### 3. Score the Leads
```bash
curl -X POST https://your-app-name.onrender.com/api/leads/score
```

### 4. Get Scored Results (JSON)
```bash
curl -X GET https://your-app-name.onrender.com/api/leads/results
```

### 5. Export Results to CSV
```bash
curl -X GET https://your-app-name.onrender.com/api/results/export -o scored_leads.csv
```

---

## Postman Collection Setup

You can also test the APIs easily using **Postman**.  

### **Initial Setup**
1. In Postman, create a collection variable named `{{baseUrl}}` and set its value to your local server (e.g., `http://localhost:3000`) or your live Render URL.
2. Follow the requests in order.

### **1. Set Product Offer**
- **Method:** POST  
- **URL:** `{{baseUrl}}/api/offer`  
- **Body:** Raw → JSON  
```json
{
    "name": "AI Outreach Automation Pro",
    "value_props": [
        "Automates cold outreach 24/7",
        "Generates 6x more qualified meetings",
        "Personalizes emails at scale"
    ],
    "ideal_use_cases": [
        "B2B SaaS companies in the mid-market segment",
        "Sales teams looking to improve efficiency",
        "Growth and marketing leaders"
    ]
}
```

### **2. Upload Leads**
- **Method:** POST  
- **URL:** `{{baseUrl}}/api/leads/upload`  
- **Body:** form-data → Key: `leads_file` → Type: File → Select `leads.csv`

Example `leads.csv`:
```csv
name,role,company,industry,location,linkedin_bio
Ava Patel,Head of Growth,FlowMetrics,B2B SaaS,New York,"Leader in growth marketing for mid-market SaaS companies. Passionate about scaling revenue streams through innovative outreach and automation."
Ben Carter,Senior Sales Manager,DataCorp,Technology,London,"Experienced Senior Sales Manager with a demonstrated history of working in the computer software industry. Skilled in Sales, SaaS, and Go-to-Market Strategy."
Charlie Davis,Junior Accountant,RetailGoods Inc.,Retail,Chicago,"Detail-oriented accountant focused on financial reporting and compliance for consumer goods. Eager to learn new tools."
Diana Ross,CEO & Founder,Innovate Solutions,,Miami,"Founder of Innovate Solutions, a startup focused on AI-driven market analysis."
```

### **3. Score the Leads**
- **Method:** POST  
- **URL:** `{{baseUrl}}/api/score`  

### **4. Get Scored Results**
- **Method:** GET  
- **URL:** `{{baseUrl}}/api/results`  

### **5. Export Results as CSV**
- **Method:** GET  
- **URL:** `{{baseUrl}}/api/results/export`  
- **Action:** Use "Send and Download" to save the file.

---

## Logic Explanation

### Rule-Based Scoring (Max 50 Points)

- **Role Relevance (+20 points)**: Awarded if the lead's role contains keywords like Head, VP, Director, CEO. Influencer roles (Senior, Lead) get +10 points.
- **Industry Match (+20 points)**: Awarded if the industry is an exact match for the Ideal Customer Profile (e.g., SaaS, Technology). Adjacent industries get +10 points.
- **Data Completeness (+10 points)**: Awarded if all fields in the lead's profile are present and not empty.

### AI-Powered Scoring (Max 50 Points)

The AI layer uses Google Gemini with the following prompt structure to classify intent and provide a reasoning.

**AI Prompt Used:**

You are an expert B2B sales development representative. Your task is to analyze a prospect's profile against a product offer and classify their buying intent.

**Product/Offer Information:**
- Product Name: "[Offer Name]"
- Key Value Propositions: [Value Props]
- Ideal Customer Profile / Use Cases: [Use Cases]

**Prospect Information:**
- Name: [Lead Name]
- Role: "[Lead Role]"
- Company: [Lead Company]
- Industry: [Lead Industry]
- LinkedIn Bio: "[Lead Bio]"

Based on this, classify the prospect's buying intent as "High", "Medium", or "Low". Provide a concise, one-sentence explanation for your classification.
Return your answer ONLY as a valid JSON object with the keys "intent" and "reasoning".

### AI Score Mapping:
- **High**: 50 points
- **Medium**: 30 points
- **Low**: 10 points

The **Final Score** is the sum of `rule_score + ai_score`.
