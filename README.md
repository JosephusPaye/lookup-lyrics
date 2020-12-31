# lookup-lyrics

![Node.js CI](https://github.com/JosephusPaye/lookup-lyrics/workflows/Node.js%20CI/badge.svg)

🎶 Lookup lyrics of songs using online sources. Designed for use in Node.js (v10 and above).

This project is part of [#CreateWeekly](https://twitter.com/JosephusPaye/status/1214853295023411200), my attempt to create something new publicly every week in 2020.

## How it works

Lookup provides a common interface for looking up song lyrics using various online sources. An adapter is used to implement this interface for each source. Currently, the available sources are:

- [Genius](https://genius.com/)

## Installation

```
npm install @josephuspaye/lookup-lyrics --save
```

## Usage

### Look up lyrics

The following example looks up lyrics of the song _Happy_ by Pharrell Williams:

```js
const { getLyrics } = require('@josephuspaye/lookup-lyrics');

async function main() {
  try {
    const lyrics = await getLyrics('happy', 'pharrell williams');
    console.log(JSON.stringify(lyrics, null, '  '));
  } catch (error) {
    console.log('unable to look up lyrics', error);
  }
}

main();
```

<details>
<summary>View output</summary>

```js
{
  "attribution": "Lyrics from Genius.com",
  "song": "Happy",
  "artist": "Pharrell Williams",
  "album": "G I R L (2014)",
  "lines": "[Produced by Pharrell Williams]\n\n[Verse 1]\nIt might seem crazy what I'm 'bout to say\nSunshine she's here, you can take a break\nI'm a hot air balloon that could go to space\nWith the air, like I don't care, baby, by the way\n\n[Chorus]\n(Because I'm happy)\nClap along if you feel like a room without a roof\n(Because I'm happy)\nClap along if you feel like happiness is the truth\n(Because I'm happy)\nClap along if you know what happiness is to you\n(Because I'm happy)\nClap along if you feel like that's what you wanna do\n\n[Verse 2]\nHere come bad news, talking this and that (Yeah!)\nWell, give me all you got, don't hold it back (Yeah!)\nWell, I should probably warn ya, I'll be just fine (Yeah!)\nNo offense to you, donΓÇÖt waste your time, here's why\n\n[Chorus]\n(Because I'm happy)\nClap along if you feel like a room without a roof\n(Because I'm happy)\nClap along if you feel like happiness is the truth\n(Because I'm happy)\nClap along if you know what happiness is to you\n(Because I'm happy)\nClap along if you feel like that's what you wanna do\n\n[Bridge]\nBring me down\nCan't nothing bring me down\nMy level's too high to bring me down\nCan't nothing bring me down, I said\nBring me down\nCan't nothing bring me down\nMy level's too high to bring me down\nCan't nothing bring me down, I said\n\n[Chorus]\n(Because I'm happy)\nClap along if you feel like a room without a roof\n(Because I'm happy)\nClap along if you feel like happiness is the truth\n(Because I'm happy)\nClap along if you know what happiness is to you\n(Because I'm happy)\nClap along if you feel like that's what you wanna do\n(Because I'm happy)\nClap along if you feel like a room without a roof\n(Because I'm happy)\nClap along if you feel like happiness is the truth\n(Because I'm happy)\nClap along if you know what happiness is to you\n(Because I'm happy)\nClap along if you feel like that's what you wanna do\n\n[Bridge]\nBring me down\nCan't nothing bring me down\nMy level's too high to bring me down\nCan't nothing bring me down, I said...\n\n[Chorus]\n(Because I'm happy)\nClap along if you feel like a room without a roof\n(Because I'm happy)\nClap along if you feel like happiness is the truth\n(Because I'm happy)\nClap along if you know what happiness is to you\n(Because I'm happy)\nClap along if you feel like that's what you wanna do\n(Because I'm happy)\nClap along if you feel like a room without a roof\n(Because I'm happy)\nClap along if you feel like happiness is the truth\n(Because I'm happy)\nClap along if you know what happiness is to you\n(Because I'm happy)\nClap along if you feel like that's what you wanna do\n"
}
```

</details>

## API

### `getLyrics()`

Look up lyrics for the given song by the given artist.

```ts
function getLyrics(
  song: string,
  artist: string,
  options?: {
    language?: LookupLyrics.Language;
    source?: LookupLyrics.Source;
  }
): Promise<LookupLyrics.LyricsResult>;
```

### Types

The following types are used for parameters and return values.

```ts
namespace LookupLyrics {
  /**
   * The sources available for looking up lysics.
   */
  type Source = 'genius';

  /**
   * The available languages
   */
  type Language = 'en';

  /**
   * Result of looking up lyrics
   */
  interface LyricsResult {
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
```

### Errors

`getLyrics()` may throw errors matching the following interface:

```ts
/**
 * A look up error.
 */
interface Error {
  originalError?: any;
  message?: string;
  type: ErrorType;
}
```

Where `type` is a member of the following enum:

```ts
/**
 * The errors that could occur when looking up lyrics.
 */
enum ErrorType {
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
```

## Licence

[MIT](LICENCE)
