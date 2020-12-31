const { getLyrics } = require('.');

async function main() {
  try {
    const lyrics = await getLyrics('happy', 'pharrell williams');
    console.log(JSON.stringify(lyrics, null, '  '));
  } catch (error) {
    console.log('unable to look up lyrics', error);
  }
}

main();
