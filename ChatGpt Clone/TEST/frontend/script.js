const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask-btn");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

async function generate(text) {
  // 1. append message to ui
  // 2. send it to the llm
  // 3. append response to the ui

  const msg = document.createElement("div");
  msg.className = "my-6 bg-neutral-800 p-3 rounded-xl max-w-fit ml-auto";
  msg.textContent = text;

  chatContainer.appendChild(msg);
  input.value = "";

  await serverCall(text);
}

// <div max-w-fit>I am fine, How are you?</div>

async function serverCall(text) {
  const loading = document.createElement("div")
  loading.className = "text-red-900 py-2 mr-auto "
  loading.textContent = "Loading..."
  chatContainer.appendChild(loading)
  const response = await fetch(`http://localhost:3001/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text }),
  });

  const result = await response.json();
  console.log(result);


  if (!response.ok) {
    const reply = document.createElement("div");
    reply.className = "max-w-fit mr-auto";
    reply.textContent = "Something Went Wrong";
    chatContainer.appendChild(reply);
    input.value = "";
    loading.textContent = ""
  } else {
    const reply = document.createElement("div");
    reply.className = "max-w-fit mr-auto";
    reply.textContent = result.message;
    chatContainer.appendChild(reply);
    input.value = "";
    loading.textContent = ""
  }
}

async function handleAsk(e) {
  const text = input.value.trim();
  if (!text) {
    return;
  }
  await generate(text);
}

async function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }

    await generate(text);
  }
}
