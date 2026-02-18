type DefinitionArray = string[];
type Str = string;

interface MeaningStructure {
  difinition: DefinitionArray;
  partOfSpeech: Str;
  synonyms: DefinitionArray;
  antonyms?: DefinitionArray;
}

async function getTransilation<T = any>(word: Str): Promise<T> {
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
  const meaningData = await getTransilation(textElement?.value as Str);
  const nounMeaning: MeaningStructure = meaningData[0].meanings[0];
  const verbMeaning: MeaningStructure = meaningData[0].meanings[1];
  let audio: Str = meaningData[0].phonetics[0].audio;
  let srcs = meaningData[0].sourceUrls[0];
});
type PickOne = Pick<
  MeaningStructure,
  "difinition" | "partOfSpeech" | "synonyms"
>;

function nounPopulation(obj: PickOne, className: string): void {
  const sectionToGet = document.querySelector(`.${className}`);
  const { difinition, partOfSpeech, synonyms } = obj;
  console.log(obj);
}
