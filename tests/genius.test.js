// @ts-check

import fs from 'fs';
import path from 'path';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import cheerio from 'cheerio';

import { genius } from '../dist/adapters/genius.js';

const legacyHtml = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'legacy.genius.html'),
  'utf-8'
);

const legacyNewHtml = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'legacy.new.genius.html'),
  'utf-8'
);

test('genius.url() creates and normalizes URL', () => {
  assert.is(
    genius.url('Where Is the Love?', 'Black Eyed PeAS', 'eN'),
    'https://genius.com/Black-eyed-peas-where-is-the-love-lyrics',
    'Normalizes the song and artist in the URL'
  );

  assert.is(
    genius.url('Labor Day (It’s a Holiday)', 'Black Eyed PeAS', 'eN'),
    'https://genius.com/Black-eyed-peas-labor-day-its-a-holiday-lyrics',
    'Normalizes the song and artist in the URL'
  );

  assert.is(
    genius.url('say the name', 'Clipping.', 'en'),
    'https://genius.com/Clipping-say-the-name-lyrics',
    'Normalizes the song and artist in the URL'
  );
});

test('genius.getLyrics() result has the expected shape', () => {
  const $ = cheerio.load(Math.random() > 0.5 ? legacyHtml : legacyNewHtml);
  const result = genius.getLyrics($, 'legacy', 'eminem', 'en');

  // .attribution
  assert.type(result.attribution, 'string', '.attribution is of type string');

  // .song
  assert.type(result.song, 'string', '.song is of type string');

  // .artist
  assert.type(result.artist, 'string', '.artist is of type string');

  // .album
  assert.type(result.album, 'string', '.album is of type string');

  // .lines
  assert.type(result.lines, 'string', '.lines is of type string');
});

test('genius.getLyrics() result includes attribution', () => {
  const $ = cheerio.load(Math.random() > 0.5 ? legacyHtml : legacyNewHtml);
  const result = genius.getLyrics($, 'legacy', 'eminem', 'en');
  assert.is(result.attribution, 'Lyrics from Genius.com');
});

test('genius.getLyrics() result includes expected song, artist, album, and lyrics', () => {
  const $ = cheerio.load(Math.random() > 0.5 ? legacyHtml : legacyNewHtml);
  const { song, artist, album, lines } = genius.getLyrics(
    $,
    'legacy',
    'eminem',
    'en'
  );

  assert.ok(song, 'result has "song" attribute');
  assert.is(song, 'Legacy', 'extracts expected song title');

  assert.ok(artist, 'result has "artist" attribute');
  assert.is(artist, 'Eminem', 'extracts expected artist name');

  assert.ok(album, 'result has "album" attribute');
  assert.ok(
    album === 'The Marshall Mathers LP2 (Deluxe)' ||
      album === 'The Marshall Mathers LP2 (Deluxe) (2013)',
    'extracts expected album name'
  );

  assert.ok(lines, 'result has "lines" attribute');
  assert.ok(lines.length > 0, 'result.lines has song lyrics');
});

test.run();
