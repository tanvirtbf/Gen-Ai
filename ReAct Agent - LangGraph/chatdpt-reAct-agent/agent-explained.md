# agent.js - সম্পূর্ণ কোড ব্যাখ্যা (Line by Line)

---

## 1. Imports (Line 1-8)

```js
import readline from "node:readline/promises";
import { writeFileSync } from "node:fs";
import { MemorySaver } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
```

| Import | কাজ |
|---|---|
| `readline` | Terminal এ user এর কাছ থেকে input নেওয়ার জন্য। `node:readline/promises` ব্যবহার করা হয়েছে যাতে `await` দিয়ে input নেওয়া যায়। |
| `writeFileSync` | File system এ synchronously ফাইল লেখার জন্য। এখানে graph এর image save করতে ব্যবহার হচ্ছে। |
| `MemorySaver` | LangGraph এর একটি checkpointer। এটা agent এর conversation history / state মনে রাখে (in-memory)। প্রতিটা conversation turn এর state save করে রাখে। |
| `ChatGroq` | Groq API এর মাধ্যমে LLM (Large Language Model) ব্যবহার করার জন্য। Groq অনেক fast inference দেয়। |
| `createAgent` | LangChain এর function যেটা একটা ReAct agent তৈরি করে। ReAct = Reasoning + Acting। Agent নিজে decide করে কখন কোন tool use করবে। |
| `TavilySearch` | Tavily হলো একটি AI-optimized search engine API। এটা tool হিসেবে agent কে internet search করার ক্ষমতা দেয়। |
| `tool` | LangChain এর helper function যেটা দিয়ে custom tool define করা যায়। |
| `zod (z)` | Schema validation library। Tool এর input কেমন হবে সেটা define করতে ব্যবহার হয়। |

---

## 2. Model Setup (Line 10-16)

```js
const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
});
```

**কি হচ্ছে এখানে?**

- `ChatGroq` class দিয়ে একটি LLM instance তৈরি হচ্ছে।
- **model**: `"openai/gpt-oss-120b"` - Groq এর API দিয়ে এই model ব্যবহার করা হচ্ছে। এটি একটি open-source 120B parameter model।
- **temperature: 0** - এর মানে হলো model সবসময় সবচেয়ে confident/deterministic answer দেবে। Random বা creative answer দেবে না। 0 = কোনো randomness নেই, 1 = বেশি creative।
- **maxTokens: undefined** - Token limit সেট করা হয়নি, মানে model তার default limit পর্যন্ত output দিতে পারবে।
- **maxRetries: 2** - API call fail হলে সর্বোচ্চ ২ বার retry করবে।

---

## 3. Tavily Search Tool (Line 18-21)

```js
const search = new TavilySearch({
  maxResults: 3,
  topic: "general",
});
```

**কি হচ্ছে এখানে?**

- Tavily search tool তৈরি হচ্ছে।
- **maxResults: 3** - সর্বোচ্চ ৩টি search result return করবে।
- **topic: "general"** - সাধারণ বিষয়ে search করবে (news, finance ইত্যাদি specific topic ও সেট করা যায়)।

**কিভাবে কাজ করে?**
Agent যখন কোনো প্রশ্নের উত্তর নিজে জানে না, তখন সে এই Tavily tool কে call করে internet থেকে তথ্য আনে। যেমন: "আজকের আবহাওয়া কেমন?" - এটার জন্য agent Tavily search ব্যবহার করবে।

---

## 4. Custom Calendar Tool (Line 23-37)

```js
const calenderEvents = tool(
  async ({ query }) => {
    return JSON.stringify([
      { title: "Meeting with Tanvir", time: "2PM", location: "Dhaka" },
    ]);
  },
  {
    name: "get-calender-events",
    description: "Call to get the calender events",
    schema: z.object({
      query: z.string().describe("The query to use in calender event search"),
    }),
  },
);
```

**কি হচ্ছে এখানে?**

এটি একটি **custom tool** তৈরি করা হচ্ছে `tool()` function দিয়ে। দুইটি argument নেয়:

### প্রথম Argument - Function (কি করবে):
- `async ({ query }) => { ... }` - এই function টি আসলে tool এর logic।
- এখানে hardcoded dummy data return করা হচ্ছে - একটা meeting event।
- বাস্তবে এখানে **Google Calendar API** call করা হতো।
- `JSON.stringify()` দিয়ে JavaScript object কে string এ convert করা হচ্ছে কারণ tool এর output string হতে হয়।

### দ্বিতীয় Argument - Configuration (tool এর পরিচয়):
- **name**: `"get-calender-events"` - Tool এর নাম। Agent এই নাম দেখে tool কে চিনবে।
- **description**: Agent কে বলে দেয় এই tool কি কাজ করে। Agent এই description পড়ে decide করে কখন এই tool ব্যবহার করবে।
- **schema**: `zod` দিয়ে define করা হয়েছে যে এই tool এর input এ একটি `query` নামের string আসবে। `.describe()` দিয়ে LLM কে বলা হচ্ছে এই field এ কি ধরনের value দিতে হবে।

---

## 5. Checkpointer / Memory (Line 39)

```js
const checkpointer = new MemorySaver();
```

**কি হচ্ছে এখানে?**

- `MemorySaver` হলো একটি **in-memory checkpointer**।
- এটা agent এর conversation এর প্রতিটি state (messages, tool calls, responses) মেমরিতে save করে রাখে।
- এর ফলে agent **আগের কথা মনে রাখতে পারে** (conversation context maintain করে)।
- **সীমাবদ্ধতা**: এটা RAM এ save করে, তাই program বন্ধ হলে সব মুছে যায়। Production এ database-backed checkpointer ব্যবহার করা হয়।

---

## 6. Agent তৈরি (Line 41-45)

```js
const agent = createAgent({
  model: model,
  tools: [search, calenderEvents],
  checkpointer: checkpointer,
});
```

**কি হচ্ছে এখানে?**

এটাই মূল **ReAct Agent** তৈরি হচ্ছে। তিনটি জিনিস দেওয়া হচ্ছে:

1. **model** - কোন LLM ব্যবহার করবে (Groq এর মাধ্যমে GPT OSS 120B)
2. **tools** - agent কোন কোন tool ব্যবহার করতে পারবে:
   - `search` (Tavily - internet search)
   - `calenderEvents` (Calendar events দেখা)
3. **checkpointer** - conversation state save করার জন্য

### ReAct Agent কিভাবে কাজ করে?

ReAct pattern = **Re**asoning + **Act**ing

```
User প্রশ্ন করে
    ↓
Agent চিন্তা করে (Reasoning) - "এই প্রশ্নের উত্তর দিতে আমার কি tool দরকার?"
    ↓
যদি tool দরকার → Tool call করে (Acting) → Result পায় → আবার চিন্তা করে
যদি tool দরকার না → সরাসরি উত্তর দেয়
    ↓
Final Answer
```

এটা একটা **loop** - agent যতবার দরকার ততবার tool call করতে পারে, যতক্ষণ না সে final answer দিতে পারে।

---

## 7. Terminal Chat Interface (Line 47-77)

```js
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

while (true) {
  const userQuery = await rl.question("You: ");

  if (userQuery === "bye") {
    break;
  }

  const result = await agent.invoke({
    messages: [
      {
        role: "system",
        content: `You are a personal assistant. Use provided tools...`,
      },
      {
        role: "user",
        content: userQuery,
      },
    ],
  }, {
    configurable: { thread_id: '1' }
  });

  console.log(
    "Assistant : ",
    result.messages[result.messages.length - 1].content,
  );
}
```

**কি হচ্ছে এখানে?**

### readline interface (Line 47-50):
- Terminal এ interactive chat চালানোর জন্য `readline` interface তৈরি হচ্ছে।
- `process.stdin` = keyboard input, `process.stdout` = terminal output

### while loop (Line 52-77):
- **অসীম loop** চলে - user যতক্ষণ খুশি chat করতে পারে।
- `rl.question("You: ")` - terminal এ "You: " দেখায় এবং user এর input এর জন্য wait করে।
- `"bye"` লিখলে loop ভেঙে বের হয়ে যায়।

### agent.invoke() (Line 59-72):
- Agent কে call করা হচ্ছে দুইটি argument দিয়ে:

**প্রথম argument - messages array:**
- **system message**: Agent কে বলা হচ্ছে "তুমি একটি personal assistant। tool ব্যবহার করো তথ্য আনতে।" সাথে current date/time ও দেওয়া হচ্ছে `new Date().toUTCString()` দিয়ে।
- **user message**: User যা টাইপ করেছে সেটা।

**দ্বিতীয় argument - config:**
- `thread_id: '1'` - এটা checkpointer এর জন্য। একই thread_id মানে একই conversation। এর ফলে agent আগের কথা মনে রাখে। আলাদা thread_id দিলে নতুন conversation শুরু হতো।

### Response print (Line 73-76):
- `result.messages` হলো পুরো message history (system, user, tool calls, tool results, assistant reply)।
- `result.messages[result.messages.length - 1]` মানে **শেষ message**, যেটা agent এর final reply।
- সেটার `.content` print করা হচ্ছে।

---

## 8. Graph Visualization (Line 79-84)

```js
const drawableGraphGraphState = await agent.getGraphAsync();
const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

const filePath = "./graphState.png";
writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));
```

**কি হচ্ছে এখানে?**

Chat loop শেষ হওয়ার পরে (user "bye" বলার পরে), agent এর **internal graph structure** একটি image হিসেবে save করা হচ্ছে:

1. **`agent.getGraphAsync()`** - Agent এর পেছনে যে LangGraph state machine কাজ করছে, তার graph structure নিয়ে আসে।
2. **`drawMermaidPng()`** - সেই graph কে Mermaid diagram format এ PNG image এ convert করে।
3. **`arrayBuffer()`** - Image data কে raw bytes (ArrayBuffer) এ convert করে।
4. **`writeFileSync()`** - সেই bytes কে `graphState.png` ফাইলে save করে।

**এই graph দেখতে কেমন হয়?**

```
[__start__] → [agent] → [tools] → [agent] → [__end__]
```

এটা দেখায় কিভাবে agent ReAct loop এ কাজ করে - start থেকে agent node এ যায়, দরকার হলে tools node এ যায়, আবার agent এ ফিরে আসে, এবং শেষে end এ যায়।

---

## সম্পূর্ণ Flow Summary

```
Program Start
    ↓
Model তৈরি (Groq LLM)
    ↓
Tools তৈরি (Tavily Search + Calendar)
    ↓
Checkpointer তৈরি (Memory)
    ↓
Agent তৈরি (Model + Tools + Checkpointer)
    ↓
Chat Loop শুরু
    ↓
User input নেয় → Agent process করে → Reply দেয় → আবার input নেয়
    ↓
User "bye" বললে loop শেষ
    ↓
Agent এর graph structure PNG image হিসেবে save হয়
    ↓
Program End
```

---

## মূল Concepts

| Concept | ব্যাখ্যা |
|---|---|
| **ReAct Agent** | Reasoning + Acting pattern। Agent নিজে চিন্তা করে কখন কোন tool ব্যবহার করবে। |
| **Tool** | Agent এর হাতের যন্ত্র। Agent নিজে সব জানে না, tool দিয়ে বাইরের তথ্য আনে। |
| **Checkpointer** | Conversation এর state save করে। একই thread_id তে আগের কথা মনে থাকে। |
| **LangGraph** | LangChain এর framework যেটা agent কে state machine / graph হিসেবে তৈরি করে। |
| **System Prompt** | Agent কে তার role / behavior বলে দেয়। এখানে: "তুমি personal assistant"। |
| **thread_id** | Conversation identifier। একই id = একই conversation context। |
