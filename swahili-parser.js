// Swahili language parser -- swahili-parser.js
// Parses a Swahili phrase into syllables
// By: Sean Miller
// 2018-05-24

export class SwahiliParser {
  /**
   * Verifies that a char is not a vowel
   * @param {string} letter A swahili letter
   * @return {boolean} A boolean of whether the char is not a variable
   */
  static isNotVowel(letter) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return !vowels.includes(letter);
  }

  /**
   * Parses a Swahili word into an array of its syllables
   * @param {string} word A swahili word
   * @return {Array<string>} An array of the syllables of the original word
   */
  static parseWordIntoSyllables(word) {
    const syllablesOfWord = [];
    let currentSyllable = '';
    let vowelIndex = 0;

    // make sure that the string is only in lower case or else algorithm will
    // break
    word = word.toLowerCase();

    // check for the special n or m at the beginning of the word, which can get
    // its own syllable
    if ((word.charAt(0) === 'n') && (word.charAt(1) !== '') &&
      (this.isNotVowel(word.charAt(1))) && (word.charAt(1) !== 'g')) {
      syllablesOfWord.push('n');
      word = word.slice(1);
    } else if ((word.charAt(0) === 'm') && (this.isNotVowel(word.charAt(1)))) {
      syllablesOfWord.push('m');
      word = word.slice(1);
    }

    while (word !== '') {
      // reset the vowel index to the beginning of the words
      vowelIndex = 0;

      // the vast majority of syllables in Swahili are open syllables
      // (i.e. end in a vowel), so check until a vowel is found
      while (this.isNotVowel(word.charAt(vowelIndex))) {
        vowelIndex++;
        // check if word ends with a consonant
        // in Swahili, this does not happen often if ever
        if (vowelIndex === word.length) {
          // if somehow the last letter is not a vowel,
          // append the word to the syllables
          // since the word will only be one syllable
          syllablesOfWord.push(word);
          return syllablesOfWord;
        }
      }

      // vowel has been found, current syllable is substring from
      // beginning to current vowel UNLESS the next letter is an m,
      // 0R an n that DOES NOT  have a g after it
      if ((word.charAt(vowelIndex + 1) === 'n') &&
        (word.charAt(vowelIndex + 2) !== '') &&
        (word.charAt(vowelIndex + 2) !== 'g') &&
        (this.isNotVowel(word.charAt(vowelIndex + 2)))) {
        currentSyllable = word.slice(0, vowelIndex + 2);
        word = word.slice(vowelIndex + 2);
      }
      // check for syllable ending in m
      else if (
        (word.charAt(vowelIndex + 1) === 'm') &&
        (word.charAt(vowelIndex + 2) !== '') &&
        (this.isNotVowel(word.charAt(vowelIndex + 2)))) {
        currentSyllable = word.slice(0, vowelIndex + 1);
        word = word.slice(vowelIndex + 1);
      }
      // check for the one closed syllable case, where an
      // arabic loan word causes an '(C)al' sound
      else if (
        (word.charAt(vowelIndex) === 'a') &&
        (word.charAt(vowelIndex + 1) !== '') &&
        (word.charAt(vowelIndex + 1) === 'l') &&
        (word.charAt(vowelIndex + 2) !== '') &&
        (this.isNotVowel(word.charAt(vowelIndex + 2)))) {
        currentSyllable = word.slice(0, vowelIndex + 2);
        word = word.slice(vowelIndex + 2);
      }
      // the most general case of a syllable being CCV or CV or
      // even CCCV - in all cases, an open syllable
      else {
        currentSyllable = word.slice(0, vowelIndex + 1);
        // now, cut the word into the string of the rest of the syllables
        word = word.slice(vowelIndex + 1);
      }
      syllablesOfWord.push(currentSyllable);
    }
    return syllablesOfWord;
  }

  /**
   * Parses a phrase of swahili words into a long string of
   * its syllables that can be output as speech via
   * Google Chrome TTS API (by using indonesian voice)
   * @param {string} sentence A swahili phrase
   * @return {string} A string of the syllables of the phrase seperated by a delimeter
   * (i.e. "ni-na-pen-da__ki-swa-hi-li_")
   */
  static parseSentenceIntoSyllables(sentence) {
    sentence = sentence.toLowerCase();

    let syllablesOfSentence = '';
    const shortDelimeter = ' ';
    const longDelimeter = '.';
    let syllablesOfWord = [];
    const words = sentence.split(' ');

    for (let word of words) {
      syllablesOfWord = this.parseWordIntoSyllables(word);

      syllablesOfWord.forEach(syllable => {
        syllablesOfSentence += syllable;
        syllablesOfSentence += shortDelimeter;
      });

      // push an empty syllable to signify a pause between words
      syllablesOfSentence += longDelimeter;
    }

    return syllablesOfSentence;
  }
}
