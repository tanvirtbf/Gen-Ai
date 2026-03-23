const input = document.getElementById("input");
const ask = document.getElementById("ask");
const chatContainer = document.getElementById("chat-container");

input.addEventListener("keyup", handleInput);
ask.addEventListener("click", handleAsk);

async function generate(text) {
    input.remove();
    console.log('text: ', text)
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
