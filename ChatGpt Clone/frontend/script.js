const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");

const threadId =
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

const loading = document.createElement("div");
loading.className = "my-6";
loading.textContent = "Thinking...";

async function callServer(inputText) {
  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      threadId: threadId,
      message: inputText,
    }),
  });

  if (!response.ok) {
    throw new Error("Error generating the response!");
  }

  const data = await response.json();
  return data.message;
}

async function generate(text) {
  /**
   * 1. append message to ui
   * 2. send it to the LLM
   * 3. append response to the ui
   */

  const msg = document.createElement("div");
  msg.className = `my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`;
  msg.textContent = text;
  chatContainer?.appendChild(msg);
  input.value = "";

  chatContainer?.appendChild(loading);

  const result = await callServer(text);
  const ans = document.createElement("div");
  ans.className = `my-6 bg-neutral-800 p-3 rounded-xl mr-auto max-w-fit`;
  ans.textContent = result;
  loading.remove();
  chatContainer?.appendChild(ans);
}

async function handleAsk(e) {
  console.log(e);
  const text = input?.value.trim();
  if (!text) {
    return;
  }

  await generate(text);
}

async function handleEnter(e) {
  console.log(e);
  if (e.key === "Enter") {
    const text = input?.value.trim();
    if (!text) {
      return;
    }

    await generate(text);
  }
}
