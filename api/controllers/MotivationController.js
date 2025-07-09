import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const generateMotivation = async (req, res) => {
  try {
    const prompt = `Write a short, warm, and inspiring message (1–2 sentences, max 20 words) that encourages people to adopt animals through the Adoptly app. The message should be emotional, motivational, and suitable for a motivational banner.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 60,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MOTIVATION_GENERATOR}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'AdoptlyMotivation',
        },
      }
    );

    const motivation = response.data.choices[0].message.content.trim();
    res.json({ message: motivation });
  } catch (err) {
    console.error('Error generating motivation:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate motivational message.' });
  }
};
