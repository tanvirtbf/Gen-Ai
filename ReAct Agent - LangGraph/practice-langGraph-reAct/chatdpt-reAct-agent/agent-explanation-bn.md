# `agent.js` বাংলায় ব্যাখ্যা (Basic থেকে)

এই ফাইলে `agent.js` এর প্রতিটা লাইন সহজ ভাষায় বোঝানো হয়েছে। আগে কিছু মৌলিক ধারণা (fundamentals) পরিষ্কার করি, তারপর কোডে যাব।

---

## ১. আগে কিছু মৌলিক ধারণা

### LLM (Large Language Model) কী?
LLM হলো একটা AI মডেল, যেটা টেক্সট পড়ে আর টেক্সট লিখে উত্তর দেয়। যেমন ChatGPT, Llama, GPT-OSS ইত্যাদি।

**সমস্যা:** LLM শুধু ট্রেনিং এর সময় যা শিখেছে সেটাই জানে। আজকে ঢাকার আবহাওয়া কেমন, সেটা সে জানে না, কারণ এটা **লাইভ (real-time) তথ্য**।

### Tool কী?
Tool হলো একটা ফাংশন বা সার্ভিস, যেটা LLM দরকার হলে ব্যবহার করতে পারে। যেমন:
- ইন্টারনেটে সার্চ করার tool
- ক্যালকুলেটর tool
- ডাটাবেস থেকে ডাটা আনার tool

এই কোডে আমরা **Tavily Search** নামের একটা ওয়েব সার্চ tool ব্যবহার করছি।

### Agent কী?
সাধারণ LLM = শুধু প্রশ্ন নেয়, উত্তর দেয়।

**Agent** = LLM + Tools + নিজে সিদ্ধান্ত নেওয়ার ক্ষমতা।

Agent নিজে ঠিক করে: "এই প্রশ্নের উত্তর দিতে কি আমার tool লাগবে? লাগলে কোন tool, কী input দিয়ে?"

### ReAct কী?
ReAct = **Re**asoning + **Act**ing (চিন্তা করা + কাজ করা)।

একটা ReAct agent এভাবে লুপে কাজ করে:

```
১. Reason (চিন্তা): "ইউজার ঢাকার আবহাওয়া জানতে চায়। আমি তো এটা জানি না, সার্চ করতে হবে।"
২. Act (কাজ):     Tavily Search tool কে কল করে → "current weather in Dhaka"
৩. Observe (দেখা): সার্চের রেজাল্ট পায় → "Dhaka: 28°C, Humid..."
৪. আবার Reason:   "এখন আমার কাছে তথ্য আছে, উত্তর দিতে পারি।"
৫. Final Answer:  "ঢাকায় এখন তাপমাত্রা ২৮°C..."
```

দরকার হলে ধাপ ১–৩ একাধিকবার চলতে পারে, যতক্ষণ না LLM মনে করে উত্তর দেওয়ার মতো যথেষ্ট তথ্য পেয়েছে।

### LangChain আর LangGraph কী?
- **LangChain**: LLM দিয়ে অ্যাপ বানানোর একটা লাইব্রেরি। বিভিন্ন মডেল (Groq, OpenAI ইত্যাদি) আর tool একই নিয়মে ব্যবহার করা যায়।
- **LangGraph**: LangChain টিমের আরেকটা লাইব্রেরি, যেটা দিয়ে agent এর "flow" বা "graph" বানানো যায় (কোন ধাপের পর কোন ধাপ চলবে)। এখানে আমরা এর একটা **রেডিমেড (prebuilt)** ReAct agent ব্যবহার করছি, তাই graph নিজে বানাতে হচ্ছে না।

### Groq কী?
Groq একটা কোম্পানি যারা খুব দ্রুত গতিতে LLM চালায় (inference)। আমরা Groq এর সার্ভারে থাকা `openai/gpt-oss-120b` মডেলটা ব্যবহার করছি।

---

## ২. কোড লাইন বাই লাইন

### ধাপ ১: Import (দরকারি জিনিস নিয়ে আসা)

```js
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
```

| Import | কাজ |
|---|---|
| `ChatGroq` | Groq এর LLM এর সাথে কথা বলার ক্লাস (এটা আমাদের "মস্তিষ্ক") |
| `createReactAgent` | রেডিমেড ReAct agent বানানোর ফাংশন |
| `TavilySearch` | ইন্টারনেটে সার্চ করার tool (এটা আমাদের "হাত") |

> **নোট:** `import` সিনট্যাক্স কাজ করছে কারণ `package.json` এ `"type": "module"` দেওয়া আছে (ES Module)।

---

### ধাপ ২: `main` ফাংশন

```js
async function main() {
  ...
}
```

`async` মানে এই ফাংশনের ভেতরে আমরা `await` ব্যবহার করতে পারব। LLM বা ইন্টারনেটে কল করতে সময় লাগে, তাই উত্তর আসা পর্যন্ত অপেক্ষা (`await`) করতে হয়।

---

### ধাপ ৩: মডেল (LLM) তৈরি করা

```js
const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
});
```

- `model: "openai/gpt-oss-120b"` → কোন মডেল ব্যবহার করব। এটা OpenAI এর ওপেন-সোর্স ১২০ বিলিয়ন প্যারামিটারের মডেল, যেটা Groq এ চলছে।
- `temperature: 0` → মডেলের উত্তর কতটা "র‍্যান্ডম/ক্রিয়েটিভ" হবে।
  - `0` = সবসময় সবচেয়ে নিশ্চিত, ধারাবাহিক উত্তর (agent এর জন্য এটাই ভালো, কারণ tool ঠিকভাবে কল করতে হবে)
  - `1` বা বেশি = বেশি ক্রিয়েটিভ, প্রতিবার ভিন্ন উত্তর

> **API Key:** `ChatGroq` নিজে থেকেই environment variable থেকে `GROQ_API_KEY` পড়ে নেয়। তাই কোডে key লিখতে হয়নি।

---

### ধাপ ৪: Search Tool তৈরি করা

```js
const search = new TavilySearch({
  maxResult: 5,
  topic: "general",
});
```

- `maxResult: 5` → সর্বোচ্চ কয়টা সার্চ রেজাল্ট আনবে।
- `topic: "general"` → কোন ধরনের সার্চ। `"general"` মানে সাধারণ সার্চ (অন্য অপশন যেমন `"news"`, `"finance"` আছে)।

> **API Key:** এটাও নিজে থেকে `TAVILY_API_KEY` environment variable থেকে পড়ে।

> ⚠️ **ছোট একটা ভুল:** সঠিক অপশনের নাম `maxResults` (শেষে **s** আছে)। `maxResult` লিখলে লাইব্রেরি এটা চিনবে না, চুপচাপ উপেক্ষা (ignore) করবে এবং নিজের default মান ব্যবহার করবে। তাই ঠিক করে লেখা উচিত:
> ```js
> maxResults: 5,
> ```

---

### ধাপ ৫: Agent তৈরি করা (সবচেয়ে গুরুত্বপূর্ণ অংশ)

```js
const agent = createReactAgent({
  llm: model,
  tools: [search],
});
```

এখানে আমরা দুইটা জিনিস জোড়া লাগাচ্ছি:
- `llm: model` → agent এর **মস্তিষ্ক** (চিন্তা করবে, সিদ্ধান্ত নেবে)
- `tools: [search]` → agent এর **হাতিয়ার** (এটা একটা array, তাই চাইলে একাধিক tool দেওয়া যায়, যেমন `[search, calculator]`)

`createReactAgent` ভেতরে ভেতরে একটা ছোট graph বানায়:

```
        ┌──────────┐
START → │  agent   │ ──(tool লাগবে না)──→ END (উত্তর দাও)
        │  (LLM)   │
        └──────────┘
           │    ▲
 (tool লাগবে)  │ (tool এর রেজাল্ট ফেরত)
           ▼    │
        ┌──────────┐
        │  tools   │
        │ (Tavily) │
        └──────────┘
```

অর্থাৎ LLM যতক্ষণ tool চাইবে, ততক্ষণ `agent ↔ tools` এর মধ্যে লুপ চলবে। LLM যখন tool ছাড়াই উত্তর দেবে, তখন লুপ শেষ।

---

### ধাপ ৬: Agent কে প্রশ্ন করা (Invoke)

```js
const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "what is the current weather in dhaka?",
    },
  ],
});
```

- `invoke` মানে agent কে চালানো।
- Agent এর input হলো একটা `messages` array — অর্থাৎ চ্যাটের মেসেজগুলোর লিস্ট।
- প্রতিটা মেসেজে থাকে:
  - `role` → কে বলছে। `"user"` = আমরা (ইউজার)। অন্য role গুলো: `"system"` (নির্দেশনা), `"assistant"` (AI এর উত্তর), `"tool"` (tool এর রেজাল্ট)।
  - `content` → আসল কথা/প্রশ্ন।
- `await` → agent এর পুরো কাজ (চিন্তা + সার্চ + উত্তর) শেষ না হওয়া পর্যন্ত অপেক্ষা করো।

---

### ধাপ ৭: রেজাল্ট দেখা

```js
console.log("Result: ", result.messages[result.messages.length - 1].content);
```

`result.messages` এর ভেতরে পুরো কথোপকথনের ইতিহাস থাকে। যেমন:

| index | role | content (উদাহরণ) |
|---|---|---|
| 0 | user | "what is the current weather in dhaka?" |
| 1 | assistant (AI) | (Tavily tool কল করার অনুরোধ) |
| 2 | tool | (Tavily থেকে আসা সার্চ রেজাল্ট) |
| 3 | assistant (AI) | "ঢাকায় বর্তমান তাপমাত্রা ..." ← **ফাইনাল উত্তর** |

আমাদের শুধু শেষ উত্তরটা দরকার, তাই:
- `result.messages.length - 1` → শেষ মেসেজের index (array এর index 0 থেকে শুরু হয়, তাই length থেকে 1 বাদ)
- `.content` → সেই মেসেজের টেক্সট

> **টিপ:** agent ভেতরে কী কী করেছে দেখতে চাইলে পুরো messages প্রিন্ট করে দেখো:
> ```js
> console.log(result.messages);
> ```

---

### ধাপ ৮: `main` চালানো

```js
await main();
```

ফাংশন বানালেই হয় না, কল করতে হয়। এখানে ফাইলের একদম উপরের লেভেলে `await` ব্যবহার করা হয়েছে (**Top-level await**)। এটা শুধু ES Module এ (`"type": "module"`) কাজ করে।

---

## ৩. পুরো ফ্লো এক নজরে

```
ইউজারের প্রশ্ন: "ঢাকার আবহাওয়া কেমন?"
        │
        ▼
  [LLM - gpt-oss-120b] → "আমি জানি না, সার্চ করি"
        │
        ▼
  [Tavily Search] → ইন্টারনেট থেকে ৫টা রেজাল্ট আনে
        │
        ▼
  [LLM] → রেজাল্ট পড়ে সুন্দর উত্তর বানায়
        │
        ▼
  console.log → টার্মিনালে উত্তর প্রিন্ট
```

---

## ৪. কীভাবে চালাবে

এই ফোল্ডারে `.env` ফাইলে `GROQ_API_KEY` আর `TAVILY_API_KEY` থাকতে হবে। কোডে `dotenv` ইমপোর্ট করা নেই, তাই Node এর বিল্ট-ইন অপশন দিয়ে `.env` লোড করে চালাও (Node 20.6+):

```bash
cd chatdpt-reAct-agent
node --env-file=.env agent.js
```

---

## ৫. মনে রাখার মতো মূল কথা

1. **LLM = মস্তিষ্ক**, **Tool = হাত**, **Agent = মস্তিষ্ক + হাত + সিদ্ধান্ত নেওয়ার ক্ষমতা**।
2. **ReAct** = চিন্তা করো → কাজ করো → ফলাফল দেখো → দরকার হলে আবার।
3. `createReactAgent` এই পুরো লুপটা আমাদের জন্য রেডিমেড বানিয়ে দেয়।
4. Agent এর input/output দুটোই **messages array**।
5. ফাইনাল উত্তর থাকে **শেষ মেসেজে**।
6. `temperature: 0` agent এর জন্য ভালো, কারণ ধারাবাহিক আর নির্ভুল tool call দরকার।
