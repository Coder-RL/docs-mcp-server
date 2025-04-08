import type { Document } from "../types";
import type { ProgressCallback } from "../types";

/**
 * Strategy interface for implementing different scraping behaviors
 */
export interface ScraperStrategy {
  canHandle(url: string): boolean;
  scrape(
    options: ScraperOptions,
    progressCallback: ProgressCallback<ScraperProgress>,
    signal?: AbortSignal, // Add optional signal
  ): Promise<void>;
}

/**
 * Options for configuring the scraping process
 */
export interface ScraperOptions {
  url: string;
  library: string;
  version: string;
  maxPages?: number;
  maxDepth?: number;
  /**
   * Defines the allowed crawling boundary relative to the starting URL
   * - 'subpages': Only crawl URLs on the same hostname and within the same starting path (default)
   * - 'hostname': Crawl any URL on the same hostname, regardless of path
   * - 'domain': Crawl any URL on the same top-level domain, including subdomains
   */
  scope?: "subpages" | "hostname" | "domain";
  /**
   * Controls whether HTTP redirects (3xx responses) should be followed
   * - When true: Redirects are followed automatically (default)
   * - When false: A RedirectError is thrown when a 3xx response is received
   */
  followRedirects?: boolean;
  maxConcurrency?: number;
  ignoreErrors?: boolean;
}

/**
 * Result of scraping a single page. Used internally by HtmlScraper.
 */
export interface ScrapedPage {
  content: string;
  title: string;
  url: string;
  /** URLs extracted from page links, used for recursive scraping */
  links: string[];
}

/**
 * Progress information during scraping
 */
export interface ScraperProgress {
  pagesScraped: number;
  maxPages: number;
  currentUrl: string;
  depth: number;
  maxDepth: number;
  document?: Document;
}
