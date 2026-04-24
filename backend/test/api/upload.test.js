import supertest from 'supertest';
import app from '../../app';
import { extractChunksFromPDF } from '../../service/pdfService';
import { generateEmbedding } from '../../service/embeddingService';
import SopChunk from '../../models/SopChunk';
import SopDocs from '../../models/SopDocs';

// Mock all external dependencies
jest.mock('../../service/pdfService');
jest.mock('../../service/embeddingService');
jest.mock('../../models/SopChunk');
jest.mock('../../models/SopDocs');

describe('SOP Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/sop/upload', () => {
    it('should upload a PDF, extract chunks, generate embeddings, and store them', async () => {
      const mockChunks = ['Chunk 1 content', 'Chunk 2 content', 'Chunk 3 content'];
      extractChunksFromPDF.mockResolvedValue(mockChunks);

      const mockEmbeddings = ['embedding1', 'embedding2', 'embedding3'];
      generateEmbedding
        .mockResolvedValueOnce(mockEmbeddings[0])
        .mockResolvedValueOnce(mockEmbeddings[1])
        .mockResolvedValueOnce(mockEmbeddings[2]);   // ✅ dot added here

      const mockSopDocs = { _id: 'doc123', documentName: 'test.pdf', chunks: mockChunks.length };
      SopDocs.create.mockResolvedValue(mockSopDocs);
      SopChunk.create.mockResolvedValue({});

      const response = await supertest(app)
        .post('/api/v1/sop/upload')
        .attach('file', Buffer.from('fake PDF content', 'utf8'), 'test.pdf')
        .expect(200);

      expect(response.body.message).toBe('SOP Uploaded & Indexed Successfully');
      expect(extractChunksFromPDF).toHaveBeenCalledTimes(1);

      const filePathArg = extractChunksFromPDF.mock.calls[0][0];
      expect(typeof filePathArg).toBe('string');

      expect(SopDocs.create).toHaveBeenCalledWith({
        documentName: 'test.pdf',
        chunks: mockChunks.length,
      });

      expect(generateEmbedding).toHaveBeenCalledTimes(mockChunks.length);
      expect(generateEmbedding).toHaveBeenNthCalledWith(1, mockChunks[0]);
      expect(generateEmbedding).toHaveBeenNthCalledWith(2, mockChunks[1]);
      expect(generateEmbedding).toHaveBeenNthCalledWith(3, mockChunks[2]);

      expect(SopChunk.create).toHaveBeenCalledTimes(mockChunks.length);
      expect(SopChunk.create).toHaveBeenNthCalledWith(1, {
        text: mockChunks[0],
        embedding: mockEmbeddings[0],
        documentName: 'test.pdf',
      });
      expect(SopChunk.create).toHaveBeenNthCalledWith(2, {
        text: mockChunks[1],
        embedding: mockEmbeddings[1],
        documentName: 'test.pdf',
      });
      expect(SopChunk.create).toHaveBeenNthCalledWith(3, {
        text: mockChunks[2],
        embedding: mockEmbeddings[2],
        documentName: 'test.pdf',
      });
    });

    it('should handle errors during embedding generation gracefully (continue processing)', async () => {
      const mockChunks = ['Chunk 1', 'Chunk 2', 'Chunk 3'];
      extractChunksFromPDF.mockResolvedValue(mockChunks);

      generateEmbedding
        .mockResolvedValueOnce('embedding1')
        .mockRejectedValueOnce(new Error('Embedding service error'))
        .mockResolvedValueOnce('embedding3');

      SopDocs.create.mockResolvedValue({ documentName: 'test.pdf', chunks: 3 });
      SopChunk.create.mockResolvedValue({});

      const response = await supertest(app)
        .post('/api/v1/sop/upload')
        .attach('file', Buffer.from('fake content'), 'test.pdf')
        .expect(200);

      expect(response.body.message).toBe('SOP Uploaded & Indexed Successfully');
      expect(generateEmbedding).toHaveBeenCalledTimes(3);
      expect(SopChunk.create).toHaveBeenCalledTimes(2);
      expect(SopChunk.create).toHaveBeenCalledWith({
        text: mockChunks[0],
        embedding: 'embedding1',
        documentName: 'test.pdf',
      });
      expect(SopChunk.create).toHaveBeenCalledWith({
        text: mockChunks[2],
        embedding: 'embedding3',
        documentName: 'test.pdf',
      });
    });

    it('should return 500 if PDF extraction fails', async () => {
      extractChunksFromPDF.mockRejectedValue(new Error('PDF parsing error'));

      const response = await supertest(app)
        .post('/api/v1/sop/upload')
        .attach('file', Buffer.from('fake content'), 'test.pdf')
        .expect(500);

      expect(response.body.error).toBeDefined();
      expect(SopDocs.create).not.toHaveBeenCalled();
      expect(generateEmbedding).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/v1/sop/delete', () => {
    it('should delete all chunks and the document record for a given file name', async () => {
      SopChunk.deleteMany.mockResolvedValue({ deletedCount: 5 });
      SopDocs.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const response = await supertest(app)
        .delete('/api/v1/sop/delete')
        .send({ file: 'test.pdf' })
        .expect(201);

      expect(response.body.response).toEqual({ deletedCount: 5 });
      expect(SopChunk.deleteMany).toHaveBeenCalledWith({ documentName: 'test.pdf' });
      expect(SopDocs.deleteOne).toHaveBeenCalledWith({ documentName: 'test.pdf' });
    });

    it('should still succeed if there are no chunks (deleteMany returns 0)', async () => {
      SopChunk.deleteMany.mockResolvedValue({ deletedCount: 0 });
      SopDocs.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const response = await supertest(app)
        .delete('/api/v1/sop/delete')
        .send({ file: 'nonexistent.pdf' })
        .expect(201);

      expect(response.body.response).toEqual({ deletedCount: 0 });
    });

    it('should return 201 with zero deletions when file name is missing from request body', async () => {
      SopChunk.deleteMany.mockResolvedValue({ deletedCount: 0 });
      SopDocs.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const response = await supertest(app)
        .delete('/api/v1/sop/delete')
        .send({})
        .expect(201);

      expect(response.body.response).toEqual({ deletedCount: 0 });
      expect(SopChunk.deleteMany).toHaveBeenCalledWith({ documentName: undefined });
      expect(SopDocs.deleteOne).toHaveBeenCalledWith({ documentName: undefined });
    });

    it('should handle database errors', async () => {
      SopChunk.deleteMany.mockRejectedValue(new Error('DB error'));

      const response = await supertest(app)
        .delete('/api/v1/sop/delete')
        .send({ file: 'test.pdf' })
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/sop/retrieve', () => {
    it('should return all documents with count', async () => {
      const mockDocs = [
        { documentName: 'doc1.pdf', chunks: 3 },
        { documentName: 'doc2.pdf', chunks: 5 },
      ];
      SopDocs.find.mockResolvedValue(mockDocs);

      const response = await supertest(app)
        .get('/api/v1/sop/retrieve')
        .expect(200);

      expect(response.body).toEqual({
        No_docs: 2,
        data: mockDocs,
      });
      expect(SopDocs.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no documents exist', async () => {
      SopDocs.find.mockResolvedValue([]);

      const response = await supertest(app)
        .get('/api/v1/sop/retrieve')
        .expect(200);

      expect(response.body).toEqual({
        No_docs: 0,
        data: [],
      });
    });

    it('should handle database errors', async () => {
      SopDocs.find.mockRejectedValue(new Error('DB query failed'));

      const response = await supertest(app)
        .get('/api/v1/sop/retrieve')
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });
});