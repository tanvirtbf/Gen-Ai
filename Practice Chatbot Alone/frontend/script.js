const input = document.getElementById("input");
const ask = document.getElementById("ask");
const chatContainer = document.getElementById("chat-container");

input.addEventListener("keyup", handleInput);
ask.addEventListener("click", handleAsk);

async function callServer(text) {
    
}

async function generate(text) {
    input.value = "";

    const questionElement = document.createElement("div")
    const answerElement = document.createElement("div")

    questionElement.className = "my-6 px-4 py-1 bg-neutral-800 rounded text-white ml-auto w-fit"
    answerElement.className = "my-6 px-4 py-1 bg-neutral-800 rounded text-white mr-auto w-fit"

    questionElement.textContent = text;
    chatContainer.appendChild(questionElement)




}

async function handleInput(e) {
  if (e.key === "Enter") {
    const text = input?.value?.trim();
    await generate(text);
  }
}

async function handleAsk(e) {
  const text = input?.value?.trim();
  await generate(text);
}
