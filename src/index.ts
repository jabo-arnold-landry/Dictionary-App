type DefinitionArray = string[];
type Str = string;

interface MeaningStructure {
  definitions: Record<string, unknown>[];
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
// DOM element declaration
const formElement = document.querySelector("form");
const wordElement = document.querySelector("h1") as HTMLHeadingElement;
const phonetic = document.querySelector(".abbr") as HTMLParagraphElement;

formElement?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const textElement = formElement.querySelector("input");
  const meaningData = await getTransilation(textElement?.value as Str);
  const nounMeaning: MeaningStructure = meaningData[0].meanings[0];
  const verbMeaning: MeaningStructure = meaningData[0].meanings[1];
  let audio: Str = meaningData[0].phonetics[0].audio;
  let srcs = meaningData[0].sourceUrls[0];
  nounPopulation(nounMeaning, "noun-section");
  nounPopulation(verbMeaning, "verb-section");
  wordElement.textContent = meaningData[0].word;
  phonetic.textContent = meaningData[0].phonetic;
});

type PickOne = Pick<
  MeaningStructure,
  "definitions" | "partOfSpeech" | "synonyms"
>;

function nounPopulation(obj: PickOne, className: string): void {
  const sectionToGet = document.querySelector(`.${className}`) as HTMLElement;

  sectionToGet.innerHTML = ``;
  const { definitions, partOfSpeech, synonyms } = obj;

  const explanations = definitions
    .slice(0, 3)
    .map((element) => `<li>${element.definition}</li>`)
    .join("");

  sectionToGet.innerHTML = `
                                              <h2>${partOfSpeech}</h2>
                                              <div>
                                                <p>meaning</p>
                                                <ul>
                                                ${explanations}
                                                </ul>
                                                 <p>synoms <span>${synonyms.join(",") || "no synoms"}</span></p>
                                              </div>
                                              `;
}
