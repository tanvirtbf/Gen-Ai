 

const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask-btn");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

function generate(text) {
  // 1. append message to ui
  // 2. send it to the llm
  // 3. append response to the ui

  const msg = document.createElement("div");
  msg.className = "my-6 bg-neutral-800 p-3 rounded-xl max-w-fit ml-auto";
  msg.textContent = text;

  chatContainer.appendChild(msg);
  input.value = "";
}

function handleAsk(e) {
  const text = input.value.trim();
  if (!text) {
    return;
  }
  generate(text);
}

function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }

    generate(text);
  }
}
