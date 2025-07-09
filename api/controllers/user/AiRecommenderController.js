import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getPetRecommendation = async (req, res) => {
  const { home, children, lifestyle, preference, allergies, workHours, experience, notes } = req.body;

  const prompt = `
    I'm building a pet adoption app. A user filled in this questionnaire:
    - Home type: ${home}
    - Has children: ${children}
    - Lifestyle: ${lifestyle}
    - Preference: ${preference}
    - Allergies: ${allergies}
    - Work hours: ${workHours}
    - Pet experience: ${experience}
    - Additional notes: ${notes}

    Based on this, suggest a suitable pet type (dog, cat, bird, etc.) and explain why.
    Respond in plain text, 2–3 sentences.
    `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "deepseek/deepseek-r1:free", 
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Adoptly',
        },
      }
    );

    const recommendation = response.data.choices[0].message.content;
    res.json({ recommendation });
  } catch (error) {
    console.error('AI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Greška prilikom komunikacije sa AI-jem.' });
  }
};
