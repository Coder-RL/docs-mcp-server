import type { DocumentManagementService } from "../store";
import type { StoreSearchResult } from "../store/types";
import { logger } from "../utils/logger";
import { VersionNotFoundError } from "./errors";

export interface SearchToolOptions {
  library: string;
  version?: string;
  query: string;
  limit?: number;
  exactMatch?: boolean;
}

export interface SearchToolResult {
  results: StoreSearchResult[];
  error?: {
    message: string;
    availableVersions: Array<{ version: string; indexed: boolean }>;
  };
}

/**
 * Tool for searching indexed documentation.
 * Supports exact version matches and version range patterns.
 * Returns available versions when requested version is not found.
 */
export class SearchTool {
  private docService: DocumentManagementService;

  constructor(docService: DocumentManagementService) {
    this.docService = docService;
  }

  async execute(options: SearchToolOptions): Promise<SearchToolResult> {
    const { library, version = "latest", query, limit = 5, exactMatch = false } = options;

    logger.info(
      `🔍 Searching ${library}@${version} for: ${query}${exactMatch ? " (exact match)" : ""}`,
    );

    try {
      let versionToSearch: string | null | undefined = version;

      if (!exactMatch) {
        // If not exact match, find the best version (which might be null)
        const versionResult = await this.docService.findBestVersion(library, version);
        // Use the bestMatch from the result, which could be null
        versionToSearch = versionResult.bestMatch;

        // If findBestVersion returned null (no matching semver) AND unversioned docs exist,
        // should we search unversioned? The current logic passes null to searchStore,
        // which gets normalized to "" (unversioned). This seems reasonable.
        // If findBestVersion threw VersionNotFoundError, it's caught below.
      }
      // If exactMatch is true, versionToSearch remains the originally provided version.

      // Note: versionToSearch can be string | null | undefined here.
      // searchStore handles null/undefined by normalizing to "".
      const results = await this.docService.searchStore(
        library,
        versionToSearch,
        query,
        limit,
      );
      logger.info(`✅ Found ${results.length} matching results`);

      return { results };
    } catch (error) {
      if (error instanceof VersionNotFoundError) {
        logger.info(`ℹ️ Version not found: ${error.message}`);
        return {
          results: [],
          error: {
            message: error.message,
            availableVersions: error.availableVersions,
          },
        };
      }

      logger.error(
        `❌ Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      throw error;
    }
  }
}
