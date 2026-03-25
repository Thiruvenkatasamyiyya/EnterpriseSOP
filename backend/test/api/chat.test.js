
import supertest from 'supertest';
import app from '../../app';
import { retrieveContext } from '../../service/ragService';


// Mock the retrieveContext function
jest.mock('../../service/ragService');

// Mock the Google Generative AI library
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: jest.fn(),
      },
    })),
  };
});

// Set a fake API key for the test environment
process.env.GEMINIAPIKEY = 'test-api-key';

describe('Chat Controller - POST /api/v1/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------------------------------------
  // 1. Successful response with context
  // --------------------------------------------------------------
  it('should return an answer when context is found', async () => {
    // Mock retrieveContext to return some chunks
    const mockChunks = [
      { text: 'SOP: All employees must follow safety guidelines.', documentName: 'safety.pdf' },
      { text: 'Further details: Wear protective gear.', documentName: 'safety.pdf' },
    ];
    retrieveContext.mockResolvedValue(mockChunks);

    // Mock the Gemini API response
    const mockGenerateContent = jest.fn().mockResolvedValue({
      text: 'Employees must follow safety guidelines and wear protective gear.',
    });
    const mockGoogleGenAIInstance = {
      models: {
        generateContent: mockGenerateContent,
      },
    };
    const { GoogleGenAI } = require('@google/genai');
    GoogleGenAI.mockImplementation(() => mockGoogleGenAIInstance);

    const question = 'What safety rules apply?';
    const res = await supertest(app)
      .post('/api/v1/chat')
      .send({ question })
      .expect(200);

    expect(res.body.answer).toBe('Employees must follow safety guidelines and wear protective gear.');
    expect(res.body.sources).toEqual(['safety.pdf', 'safety.pdf']);

    // Verify retrieveContext was called with the question
    expect(retrieveContext).toHaveBeenCalledWith(question);

    // Verify Gemini was called with the correct prompt
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const promptArg = mockGenerateContent.mock.calls[0][0];
    expect(promptArg.contents).toContain('SOP: All employees must follow safety guidelines.');
    expect(promptArg.contents).toContain('What safety rules apply?');
  });

  // --------------------------------------------------------------
  // 2. No context found -> return fallback message
  // --------------------------------------------------------------
  it('should return "I don\'t know" when no context chunks are returned', async () => {
    retrieveContext.mockResolvedValue([]);

    const question = 'What is the holiday schedule?';
    const res = await supertest(app)
      .post('/api/v1/chat')
      .send({ question })
      .expect(200);

    expect(res.body.answer).toBe("I don't know. Not found in SOPs.");
    expect(res.body.sources).toBeUndefined(); // or empty array depending on your code
    // Gemini should not be called because we early-return
    const { GoogleGenAI } = require('@google/genai');
    const mockInstance = GoogleGenAI.mock.results[0]?.value;
    expect(mockInstance?.models.generateContent).not.toHaveBeenCalled();
  });

  // --------------------------------------------------------------
  // 3. Gemini API error (e.g., network issue)
  // --------------------------------------------------------------
  it('should handle errors from Gemini API gracefully', async () => {
    const mockChunks = [{ text: 'Some context', documentName: 'doc.txt' }];
    retrieveContext.mockResolvedValue(mockChunks);

    const mockGenerateContent = jest.fn().mockRejectedValue(new Error('Gemini API error'));
    const mockGoogleGenAIInstance = {
      models: {
        generateContent: mockGenerateContent,
      },
    };
    const { GoogleGenAI } = require('@google/genai');
    GoogleGenAI.mockImplementation(() => mockGoogleGenAIInstance);

    const question = 'Will this fail?';
    const res = await supertest(app)
      .post('/api/v1/chat')
      .send({ question })
      .expect(500); // assuming your error handler returns 500

    expect(res.body.error).toBeDefined();
    // Or if your controller sends a generic error message, adjust accordingly
  });

  // --------------------------------------------------------------
  // 4. Missing question in supertest body
  // --------------------------------------------------------------
  it('should return 400 if question is missing', async () => {
    const res = await supertest(app)
      .post('/api/v1/chat')
      .send({}) // empty body
      .expect(400);

    expect(res.body.error).toContain('question'); // adjust to your actual error message
  });

  // --------------------------------------------------------------
  // 5. retrieveContext throws an error
  // --------------------------------------------------------------
  it('should handle errors from retrieveContext', async () => {
    retrieveContext.mockRejectedValue(new Error('RAG service unavailable'));

    const question = 'Will this work?';
    const res = await supertest(app)
      .post('/api/v1/chat')
      .send({ question })
      .expect(500);

    expect(res.body.error).toBeDefined();
  });
});