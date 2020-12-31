import { LookupLyrics } from './types';

/**
 * An adapter that provides lyrics from an online source
 */
export interface SourceAdapter {
  /**
   * Get attribution for the source, for user-level display.
   */
  attribution(): string;

  /**
   * Create a URL to look up lyrics of the given song from the source.
   */
  url(song: string, artist: string, language: string): string;

  /**
   * Verify that the HTML page fetched from the source is as expected.
   * Recommended to look for a unique value in the HTML that indicates
   * a valid song lyric was returned on the page.
   */
  validateSourceResponse(
    html: string,
    song: string,
    artist: string,
    language: string
  ): boolean;

  /**
   * Parse the source HTML page to extract lyrics using cheerio.
   */
  getLyrics(
    $html: cheerio.Root,
    song: string,
    artist: string,
    language: string
  ): LookupLyrics.LyricsResult;
}
