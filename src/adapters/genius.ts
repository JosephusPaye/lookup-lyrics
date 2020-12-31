import { SourceAdapter } from '../adapters';
import { LookupLyrics } from '../types';

function attribution() {
  return 'Lyrics from Genius.com';
}

function normalizeForUrl(string: string) {
  return (
    string
      // remove quotes
      .replace(/["'“‘’”]/g, '')
      // remove common delimiters
      .replace(/[\(\)\[\]\:\.\,]/g, '')
      // replace non-alphanumeric characters with a -
      .replace(/[^a-zA-Z\d]/g, '-')
      // replace consecutive dashes with a single dash
      .replace(/\-+/g, '-')
      // convert all to lowercase
      .toLowerCase()
  );
}

export function url(song: string, artist: string) {
  const path = normalizeForUrl(artist + '-' + song + '-lyrics');
  return `https://genius.com/${path.slice(0, 1).toUpperCase() + path.slice(1)}`;
}

export function validateSourceResponse(
  html: string,
  song: string,
  artist: string,
  language: string
) {
  // Validate that we're on a valid song lyrics page by checking that there's
  // an element with class `lyrics`
  return (
    html.indexOf('class="lyrics"') !== -1 || // the old style page
    html.indexOf('class="Lyrics__Container') !== -1 // the new one
  );
}

export function getLyrics(
  $: cheerio.Root,
  song: string,
  artist: string,
  language: string
): LookupLyrics.LyricsResult {
  if ($.html().indexOf('SongPage__') > -1) {
    return getLyricsNew($, song, artist, language);
  } else {
    return getLyricsOld($, song, artist, language);
  }
}

function getLyricsNew(
  $: cheerio.Root,
  song: string,
  artist: string,
  language: string
) {
  const title = $("h1[class*='SongHeader__Title']").text().trim() ?? song;

  const artistName =
    $("a[class*='SongHeader__Artist']").text().trim() ?? artist;

  const album = (
    $("a[class*='PrimaryAlbum__Title']").text().trim().split('\n')[0] ?? ''
  ).trim();

  let lines = '';

  $("div[class*='Lyrics__Container']").each(function () {
    // Replace <br>s with new lines in the html source
    // @ts-ignore-error
    $(this).html($(this).html()?.replace(/<br>/g, '\n'));

    lines +=
      // @ts-ignore-error
      $(this).text().trim() + '\n';
  });

  return {
    attribution: attribution(),
    song: title,
    artist: artistName,
    album,
    lines,
  };
}

function getLyricsOld(
  $: cheerio.Root,
  song: string,
  artist: string,
  language: string
) {
  const title =
    $('.header_with_cover_art-primary_info-title').text().trim() ?? song;

  const artistName =
    $('.header_with_cover_art-primary_info-primary_artist').text().trim() ??
    artist;
  const album = $("span.metadata_unit-label:contains('Album')")
    .siblings('.metadata_unit-info')
    .text()
    .trim();
  const lines =
    $('.lyrics').text().trim() ??
    $('div[class*="Lyrics__Container"].lyrics').text().trim();

  return {
    attribution: attribution(),
    song: title,
    artist: artistName,
    album,
    lines,
  };
}

export const genius: SourceAdapter = {
  url,
  validateSourceResponse,
  getLyrics,
  attribution,
};
