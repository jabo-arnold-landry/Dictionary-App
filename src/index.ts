type DefinitionArray = string[];
type Str = string;

type MeaningStructure = {
  difinition: DefinitionArray;
  partOfSpeech: string;
  synonyms: DefinitionArray;
  antonyms?: DefinitionArray;
};

interface Meaning {
  noun: MeaningStructure;
}

interface VerbMeaning {
  verb: MeaningStructure;
}
const arr: any[] = [];

async function getTransilation<T = any>(word: string): Promise<T> {
  const transilationResponse = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );
  const transilationedTextData = await transilationResponse.json();
  return transilationedTextData as T;
}

const formElement = document.querySelector("form");

formElement?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const textElement = formElement.querySelector("input");
  const meaningData = await getTransilation(textElement?.value as string);
  const nounMeaning: Meaning = { noun: meaningData[0].meanings[0] };
  const verbMeaning: VerbMeaning = { verb: meaningData[0].meanings[1] };
  arr.push(nounMeaning, verbMeaning);
  let audio: Str = meaningData[0].phonetics[0].audio;
  let srcs = meaningData[0].sourceUrls[0];
});
