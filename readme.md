# Write Stuff API

Backend API service for The Write Stuff, an AI-powered writing assistant that provides feedback on world-building, character development, writing style, and story outlines.

## Features

- Text analysis endpoints powered by Claude AI
- CORS support for multiple environments
- Health check endpoint
- Environment-based configuration

## Requirements

- Node.js >= 18.0.0
- Environment variables:
  - `ANTHROPIC_API_KEY`: Your Claude API key
  - `PORT` (optional): Port number (defaults to 3000)

## Development

1. Install dependencies:
   ```bash
   npm install
