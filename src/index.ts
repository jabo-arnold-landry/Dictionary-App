type DefinitionArray = string[];

interface Meaning {
  difinition: DefinitionArray;
  partOfSpeech: string;
  synonyms: DefinitionArray;
}

interface VerbOrNoun {
  certainType: Meaning;
}

type DictionaryFilteredData = VerbOrNoun[];

async function getTransilation<T = any>(word: string): Promise<T> {
  const transilationResponse = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );
  const transilationedTextData = await transilationResponse.json();
  console.log(transilationedTextData);
  return transilationedTextData as T;
}

getTransilation("keyboard");
