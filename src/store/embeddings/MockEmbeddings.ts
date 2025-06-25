import type { Embeddings } from "@langchain/core/embeddings";

/**
 * Mock embeddings implementation for testing and development
 * Does not require external API calls
 */
export class MockEmbeddings implements Embeddings {
  constructor(private dimension: number = 1536) {}

  async embedDocuments(texts: string[]): Promise<number[][]> {
    // Generate deterministic mock embeddings based on text content
    return texts.map(text => this.generateMockEmbedding(text));
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.generateMockEmbedding(text);
  }

  private generateMockEmbedding(text: string): number[] {
    // Create a simple hash-based embedding
    const hash = this.simpleHash(text);
    const embedding: number[] = [];
    
    for (let i = 0; i < this.dimension; i++) {
      // Use text hash and position to generate pseudo-random but deterministic values
      const value = Math.sin(hash * (i + 1)) * 0.5 + Math.cos(hash * (i + 2)) * 0.3;
      embedding.push(value);
    }
    
    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) / 2147483647; // Normalize to 0-1
  }
}