const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

function generate(text) {
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
}

function handleAsk(e) {
  console.log(e);
  const text = input?.value.trim();
  if (!text) {
    return;
  }

  generate(text);
}

function handleEnter(e) {
  console.log(e);
  if (e.key === "Enter") {
    const text = input?.value.trim();
    if (!text) {
      return;
    }

    generate(text);
  }
}
