export namespace LookupLyrics {
  /**
   * The sources available for looking up lysics.
   */
  export type Source = 'genius';

  /**
   * The available languages
   */
  export type Language = 'en';

  /**
   * The errors that could occur when looking up lyrics.
   */
  export enum ErrorType {
    /**
     * The given song is empty
     */
    'SONG_EMPTY' = 'SONG_EMPTY',

    /**
     * The given artist is empty
     */
    'ARTIST_EMPTY' = 'ARTIST_EMPTY',

    /**
     * Request to the source website failed
     */
    'SOURCE_REQUEST_FAILED' = 'SOURCE_REQUEST_FAILED',

    /**
     * The given source was not recognized
     */
    'UNKNOWN_SOURCE' = 'UNKNOWN_SOURCE',

    /**
     * The given song was not found on the source page: perhaps the page format changed
     */
    'NOT_FOUND' = 'NOT_FOUND',

    /**
     * Unable to extract the lyrics from the source page
     */
    'EXTRACTION_FAILED' = 'EXTRACTION_FAILED',
  }

  /**
   * A look up error.
   */
  export interface Error {
    originalError?: any;
    message?: string;
    type: ErrorType;
  }

  /**
   * Result of looking up lyrics
   */
  export interface LyricsResult {
    /**
     * Attribution for where the lyrics are from
     */
    attribution: string;

    /**
     * The title of the song
     */
    song: string;

    /**
     * The artist of the song
     */
    artist?: string;

    /**
     * The album of the song
     */
    album?: string;

    /**
     * The lyrics text
     */
    lines: string;
  }
}
