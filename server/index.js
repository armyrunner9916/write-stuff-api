import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to accept requests from both development and production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://flourishing-baklava-a1643d.netlify.app'
  ],
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompts = {
  'world-building': 'You are an expert writing coach specializing in world-building. Analyze the following text and provide detailed feedback on the setting, atmosphere, and environmental details. Focus on consistency, believability, and opportunities for enrichment. Structure your response with clear sections for strengths, areas for improvement, and specific suggestions.',
  'character-development': 'You are an expert writing coach specializing in character development. Analyze the following text and provide detailed feedback on character depth, motivations, and arcs. Focus on authenticity, complexity, and emotional resonance. Structure your response with clear sections for strengths, areas for improvement, and specific suggestions.',
  'style-development': 'You are an expert writing coach specializing in writing style. Analyze the following text and provide detailed feedback on voice, tone, pacing, and literary techniques. Focus on clarity, engagement, and stylistic effectiveness. Structure your response with clear sections for strengths, areas for improvement, and specific suggestions.',
  'story-outline': 'You are an expert writing coach specializing in story structure and plotting. Analyze the following outline and provide detailed feedback on plot progression, pacing, story beats, and narrative arc. Focus on coherence, engagement, and dramatic effectiveness. Structure your response with clear sections for strengths, areas for improvement, and specific suggestions.'
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text || !context) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (!systemPrompts[context]) {
      return res.status(400).json({ error: 'Invalid context' });
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompts[context]
        },
        {
          role: 'user',
          content: text
        }
      ]
    });

    if (!message.content || message.content.length === 0) {
      throw new Error('No response received from Claude');
    }

    res.json({ feedback: message.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
