import { createEmbeddingModel } from "./src/store/embeddings/EmbeddingFactory";

// Test different embedding providers
console.log("Testing embedding factory...");

try {
  // Try with a mock/test setup
  const model = createEmbeddingModel("openai:text-embedding-3-small");
  console.log("✅ OpenAI model created successfully");
} catch (error) {
  console.log("❌ OpenAI failed:", error.message);
}

// Try to see if we can get docs-mcp-server to work with minimal config
console.log("Environment variables:");
console.log("DOCS_MCP_EMBEDDING_MODEL:", process.env.DOCS_MCP_EMBEDDING_MODEL);
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "SET" : "NOT SET");