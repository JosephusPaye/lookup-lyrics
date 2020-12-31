import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { getLyrics } from '../';
import { genius } from '../dist/adapters/genius.js';

test('getLyrics() throws `SONG_EMPTY` for an empty song', async () => {
  try {
    await getLyrics('');
    assert.not.ok(true, 'did not throw for empty song');
  } catch (err) {
    assert.ok(true, 'threw for empty song');
    assert.is(err.type, 'SONG_EMPTY');
  }
});

test('getLyrics() throws `ARTIST_EMPTY` for an empty artist', async () => {
  try {
    await getLyrics('ok', '');
    assert.not.ok(true, 'did not throw for empty artist');
  } catch (err) {
    assert.ok(true, 'threw for empty artist');
    assert.is(err.type, 'ARTIST_EMPTY');
  }
});

test('getLyrics() throws `UNKNOWN_SOURCE` for an unknown source', async () => {
  try {
    await getLyrics('song', 'artist', { source: 'unknown' });
    assert.not.ok(true, 'did not throw for unknown source');
  } catch (err) {
    assert.ok(true, 'threw for unknown source');
    assert.is(err.type, 'UNKNOWN_SOURCE');
  }
});

test('getLyrics() throws `SOURCE_REQUEST_FAILED` for error requesting source', async () => {
  const url = genius.url;

  genius.url = () =>
    'http://this-is-an-invalid-url-to-test-an-http-error-when-requesting-the-source';

  try {
    await getLyrics('song', 'artist');
    assert.not.ok(true, 'did not throw for request error');
  } catch (err) {
    assert.ok(true, 'threw for request error');
    assert.is(err.type, 'SOURCE_REQUEST_FAILED');
    assert.ok(err.originalError);
  }

  genius.url = url;
});

test('getLyrics() throws `NOT_FOUND` for request that resulted in a 404', async () => {
  try {
    await getLyrics('fakefake-song', 'fakefake-artist');
    assert.not.ok(true, 'did not throw for request that resulted in a 404');
  } catch (err) {
    assert.ok(true, 'threw for request that resulted in a 404');
    assert.is(err.type, 'NOT_FOUND');
  }
});

test('getLyrics() throws `NOT_FOUND` for source HTML that fails adapter validation', async () => {
  const url = genius.url;

  genius.url = () => 'https://genius.com/artists/Clipping';

  try {
    await getLyrics('fake-song', 'fake-artist');
    assert.not.ok(
      true,
      'did not throw for source HTML that fails adapter validation'
    );
  } catch (err) {
    assert.ok(true, 'threw for source HTML that fails adapter validation');
    assert.is(err.type, 'NOT_FOUND');
  }

  genius.url = url;
});

// TODO: find a way to swap out the getLyrics() function called on the adapter
test.skip('getLyrics() throws `EXTRACTION_FAILED` for an error when parsing getLyrics', async () => {
  const oldGetLyrics = genius.getLyrics;

  genius.getLyrics = () => {
    throw Error('oops');
  };

  try {
    await getLyrics('song', 'artist');
    assert.not.ok(true, 'did not throw for error during parsing');
  } catch (err) {
    assert.ok(true, 'threw for error during parsing');
    assert.is(err.type, 'EXTRACTION_FAILED');
    assert.ok(err.originalError);
  }

  genius.getLyrics = oldGetLyrics;
});

test('getLyrics() gets the lyrics of a song', async () => {
  const { song, artist, album, lines } = await getLyrics('legacy', 'eminem');

  assert.is(song, 'Legacy', 'extracts expected song title');

  assert.is(artist, 'Eminem', 'extracts expected artist name');

  assert.ok(
    album === 'The Marshall Mathers LP2 (Deluxe)' ||
      album === 'The Marshall Mathers LP2 (Deluxe) (2013)',
    'extracts expected album name'
  );

  assert.ok(lines, 'result has "lines" attribute');

  assert.ok(
    lines.indexOf('Tell me where to go') > -1,
    'result.lines has expected lines'
  );
  assert.ok(
    lines.indexOf('I used to be the type of kid') > -1,
    'result.lines has expected lines'
  );
});

test.run();
