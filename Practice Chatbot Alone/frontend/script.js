const input = document.getElementById("input");
const ask = document.getElementById("ask");
const chatContainer = document.getElementById("chat-container");

input.addEventListener("keyup", handleInput);
ask.addEventListener("click", handleAsk);

async function callServer(text) {
  const res = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: text,
    }),
  });
  const data = await res.json();

  return data.message;
}

async function generate(text) {
  input.value = "";

  const questionElement = document.createElement("div");
  const answerElement = document.createElement("div");

  questionElement.className =
    "my-6 px-4 py-1 bg-neutral-800 rounded text-white ml-auto w-fit";
  answerElement.className =
    "my-6 px-4 py-1 bg-neutral-800 rounded text-white mr-auto w-fit";

  questionElement.textContent = text;
  chatContainer.appendChild(questionElement);

  const result = await callServer(text);

  answerElement.textContent = result;
  chatContainer.appendChild(answerElement);
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
