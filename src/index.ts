// DOM element declaration
const formElement = document.querySelector("form");
const wordElement = document.querySelector("h1") as HTMLHeadingElement;
const phonetic = document.querySelector(".abbr") as HTMLParagraphElement;
const soundElement = document.querySelector("audio") as HTMLAudioElement;
const audioPlayerBtn = document.getElementById("play-audio");
const mainSection = document.getElementById("main-section") as HTMLDivElement;
const notFoundPragraph = document.getElementById(
  "not-found",
) as HTMLParagraphElement;
const reconnectionBtn = document.getElementById("err-btn") as HTMLButtonElement;

type DefinitionArray = string[];
type Str = string;

interface MeaningStructure {
  definitions: Record<string, unknown>[];
  partOfSpeech: Str;
  synonyms: DefinitionArray;
  antonyms?: DefinitionArray;
}

function modifyingDOM(element: HTMLElement, error: string): void {
  mainSection.classList.toggle("hide-show");
  element.textContent = error;
  element.style.display = "block";
}

function handlingError(status: number): never {
  switch (status) {
    case 404:
      modifyingDOM(notFoundPragraph, "not found");
      throw new Error("not found");
    case 500:
      modifyingDOM(reconnectionBtn, "retry");
      throw new Error(
        "something bad happened with our servers please try again later",
      );
    default:
      modifyingDOM(reconnectionBtn, "retry");
      throw new Error(
        "something bad happened check you're internet and try again",
      );
  }
}

async function getTransilation<T = any>(word: Str): Promise<any> {
  if (!navigator.onLine) modifyingDOM(reconnectionBtn, "retry");
  try {
    const transilationResponse = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    if (!transilationResponse.ok) {
      handlingError(transilationResponse.status);
    }

    const transilationedTextData = await transilationResponse.json();
    return transilationedTextData as T;
  } catch (err) {
    if (err instanceof Error) {
      alert(`Error: ${err.message}`);
      return err.message;
    }
  }
}

function playSound(src: Str): void {
  audioPlayerBtn?.addEventListener("click", () => {
    soundElement.src = src;
    soundElement.play();
  });
}

formElement?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const textElement = formElement.querySelector("input");
  const meaningData = await getTransilation(textElement?.value as Str);

  if (typeof meaningData === "string") return;

  const nounMeaning: MeaningStructure = meaningData[0].meanings[0];
  const verbMeaning: MeaningStructure = meaningData[0].meanings[1];
  let audio: Str =
    meaningData[0].phonetics[0].audio || meaningData[0].phonetics[1].audio;

  playSound(audio);

  let srcs = meaningData[0].sourceUrls[0];
  nounPopulation(nounMeaning, "noun-section");
  nounPopulation(verbMeaning, "verb-section");
  mainSection.classList.remove("hide-show");

  wordElement.textContent = meaningData[0].word;
  phonetic.textContent = meaningData[0].phonetic;
});

type PickOne = Pick<
  MeaningStructure,
  "definitions" | "partOfSpeech" | "synonyms"
>;

function nounPopulation(obj: PickOne, className: string): void {
  const sectionToGet = document.querySelector(`.${className}`) as HTMLElement;

  sectionToGet.innerHTML = " ";
  notFoundPragraph.textContent = "";
  reconnectionBtn.style.display = "none";
  const { definitions, partOfSpeech, synonyms } = obj;

  const explanations = definitions
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
