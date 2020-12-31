import cheerio from 'cheerio';
import { get } from 'httpie';

import { LookupLyrics } from './types';
import { SourceAdapter } from './adapters';
import { genius } from './adapters/genius';

export { LookupLyrics };

const adapters = new Map<LookupLyrics.Source, SourceAdapter>();
adapters.set('genius', genius);

/**
 * Look up lyrics for the given song by the given artist
 */
export async function getLyrics(
  song: string,
  artist: string,
  options: {
    language?: LookupLyrics.Language;
    source?: LookupLyrics.Source;
  } = {}
): Promise<LookupLyrics.LyricsResult> {
  const { language, source } = Object.assign(
    {
      language: 'en',
      source: 'genius',
    },
    options
  );

  song = song.trim();

  if (song.length === 0) {
    throw error(LookupLyrics.ErrorType.SONG_EMPTY, 'the given song is empty');
  }

  if (artist.length === 0) {
    throw error(
      LookupLyrics.ErrorType.ARTIST_EMPTY,
      'the given artist is empty'
    );
  }

  const sourceAdapter = adapters.get(source);

  if (!sourceAdapter) {
    throw error(
      LookupLyrics.ErrorType.UNKNOWN_SOURCE,
      'the given source was not found'
    );
  }

  const url = sourceAdapter.url(song, artist, language);
  const html = await fetchHtml(url);

  if (!sourceAdapter.validateSourceResponse(html, song, artist, language)) {
    throw error(
      LookupLyrics.ErrorType.NOT_FOUND,
      "fetched source HTML page doesn't match expected, perhaps the source format has changed"
    );
  }

  const $html = cheerio.load(html);

  try {
    return sourceAdapter.getLyrics($html, song, artist, language);
  } catch (err) {
    throw error(
      LookupLyrics.ErrorType.EXTRACTION_FAILED,
      'unable to extract lyrics from the source page',
      err
    );
  }
}

async function fetchHtml(url: string) {
  try {
    const { data } = await get(url, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
    });
    return data.trim();
  } catch (err) {
    if (err.statusCode === 404) {
      throw error(
        LookupLyrics.ErrorType.NOT_FOUND,
        'lyrics source page was not found for the given URL'
      );
    }

    throw error(
      LookupLyrics.ErrorType.SOURCE_REQUEST_FAILED,
      'failed to fetch HTML page from source',
      err
    );
  }
}

function error(
  type: LookupLyrics.ErrorType,
  message?: string,
  originalError?: any
): LookupLyrics.Error {
  const err = new Error(message);
  (err as any).type = type;
  (err as any).originalError = originalError;
  return (err as unknown) as LookupLyrics.Error;
}
