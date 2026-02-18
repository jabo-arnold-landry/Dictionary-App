type DefinitionArray = string[];

interface Meaning {
  noun: {
    difinition: DefinitionArray;
    partOfSpeech: string;
    synonyms: DefinitionArray;
    antonyms?: DefinitionArray;
  };
}
const arr: Meaning[] = [];

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
  arr.push(nounMeaning);
  console.log(meaningData[0].phonetics);
});
