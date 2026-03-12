# Gemini API Setup Guide

This document explains how the Gemini API is integrated into the backend following the official Google documentation.

## Overview

The backend uses the official `@google/generative-ai` SDK to integrate Google's Gemini AI models for communication assessment features.

**Official Documentation:** https://ai.google.dev/gemini-api/docs/get-started/node

## Installation

The SDK is already installed via npm:

```bash
npm install @google/generative-ai
```

## Configuration

### 1. Get Your API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key or use an existing one

### 2. Set Environment Variable

Add your API key to the `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_api_key_here
```

**Security Note:** Never commit your API key to version control. The `.env` file is already in `.gitignore`.

## Available Models

Your API key has access to the following models (as of March 2026):

### Recommended Models:
- `gemini-2.5-flash` - Latest stable Flash model (recommended for most use cases)
- `gemini-flash-latest` - Alias for the latest Flash model
- `gemini-2.0-flash` - Gemini 2.0 Flash
- `gemini-2.5-pro` - Latest stable Pro model (more capable, slower)
- `gemini-pro-latest` - Alias for the latest Pro model

### To List All Available Models:

```bash
node list-models.js
```

## Testing the API

### Quick Test

Run the test script to verify your API connection:

```bash
node test-gemini.js
```

Expected output:
```
✨ Gemini API is working perfectly!
```

## Implementation Details

### Service File: `services/gemini.service.js`

The service implements two main functions:

#### 1. `generateQuestions(jobTitle, company)`

Generates communication assessment questions for a specific job role.

**Parameters:**
- `jobTitle` (string): Job title (e.g., "Frontend Developer")
- `company` (string): Company name

**Returns:**
```javascript
{
  questions: [
    { id: "q1", text: "Question text...", type: "email" },
    // ... more questions
  ],
  timeLimit: 10 // minutes
}
```

#### 2. `evaluateAnswers(questions, answers)`

Evaluates candidate responses and provides scores and feedback.

**Parameters:**
- `questions` (array): Array of question objects
- `answers` (array): Array of answer objects with `questionId` and `answer`

**Returns:**
```javascript
{
  clarityScore: 85,
  toneScore: 90,
  grammarScore: 80,
  structureScore: 85,
  communicationScore: 84,
  feedback: "Detailed feedback text..."
}
```

### Features

1. **Model Fallback**: Automatically tries multiple models if one fails
2. **Retry Logic**: Handles quota exceeded errors with automatic retry
3. **Error Handling**: Comprehensive error handling for network issues, API errors, etc.
4. **JSON Parsing**: Handles both plain JSON and markdown-wrapped JSON responses

## Rate Limits

The Gemini API has rate limits based on your plan:

- **Free Tier**: Limited requests per minute/day
- **Paid Tier**: Higher limits based on your plan

**Rate Limit Documentation:** https://ai.google.dev/gemini-api/docs/rate-limits

### Handling Quota Exceeded

If you see "quota exceeded" errors:

1. Wait a few minutes (free tier resets periodically)
2. Check your usage at https://ai.google.dev/
3. Consider upgrading your plan for higher limits
4. The service automatically tries alternative models when one hits quota

## API Usage in Controllers

Example usage in `controllers/communication.controller.js`:

```javascript
const { generateQuestions, evaluateAnswers } = require('../services/gemini.service');

// Generate questions
const result = await generateQuestions("Software Engineer", "Tech Corp");

// Evaluate answers
const scores = await evaluateAnswers(questions, candidateAnswers);
```

## Troubleshooting

### Error: "GEMINI_API_KEY not set"

**Solution:** Add your API key to the `.env` file

### Error: "404 Not Found" or "Model not available"

**Solution:** The model name might be incorrect. Run `node list-models.js` to see available models.

### Error: "429 Quota exceeded"

**Solution:** 
- Wait a few minutes (free tier limits)
- Check your usage at https://ai.google.dev/
- The service will automatically try alternative models

### Error: "Invalid API key"

**Solution:**
- Verify your API key is correct
- Ensure there are no extra spaces or characters
- Generate a new API key if needed

## Best Practices

1. **Keep API Key Secret**: Never expose your API key in client-side code
2. **Monitor Usage**: Regularly check your API usage to avoid unexpected quota limits
3. **Handle Errors**: Always implement proper error handling in your application
4. **Use Appropriate Models**: Use Flash models for speed, Pro models for complex tasks
5. **Cache Results**: Consider caching AI responses when appropriate to reduce API calls

## Additional Resources

- [Official Documentation](https://ai.google.dev/gemini-api/docs)
- [Node.js Quickstart](https://ai.google.dev/gemini-api/docs/get-started/node)
- [Model Documentation](https://ai.google.dev/gemini-api/docs/models/gemini)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [API Reference](https://ai.google.dev/api)

## Support

For issues with the Gemini API:
- Visit the [Google AI Forum](https://discuss.ai.google.dev/)
- Check the [official documentation](https://ai.google.dev/)
- Review the [GitHub repository](https://github.com/google-gemini/generative-ai-js)
