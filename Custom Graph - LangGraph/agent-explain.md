# agent.js - সম্পূর্ণ কোড রিভিউ (বাংলায়)

## এই ফাইলটা কী করে?

এই ফাইলটা একটা **ReAct AI Agent** তৈরি করে। ReAct মানে হলো **Reasoning + Acting** — অর্থাৎ AI নিজে চিন্তা করে, সিদ্ধান্ত নেয়, এবং প্রয়োজনে tool (যেমন internet search) ব্যবহার করে উত্তর দেয়।

সোজা কথায়: তুমি AI কে একটা প্রশ্ন করবে, AI বুঝবে যে এই প্রশ্নের উত্তর দিতে internet search লাগবে, তারপর নিজে search করে তোমাকে উত্তর দিবে।

---

## লাইন বাই লাইন ব্যাখ্যা

### লাইন ১-৩: Import (প্যাকেজ আনা)

```js
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";
import { TavilySearch } from "@langchain/tavily";
```

**`import { ChatGroq } from "@langchain/groq"`**
- এটা Groq এর LLM (Large Language Model) ব্যবহার করার জন্য।
- Groq হলো একটা AI inference platform যেটা অনেক দ্রুত গতিতে AI model চালাতে পারে।
- `ChatGroq` class টা দিয়ে তুমি Groq এর মাধ্যমে যেকোনো AI model এর সাথে কথা বলতে পারবে।

**`import { createAgent } from "langchain"`**
- এটা হলো মূল function যেটা দিয়ে ReAct Agent তৈরি হয়।
- `createAgent` একটা agent বানায় যেটা নিজে চিন্তা করতে পারে এবং tools ব্যবহার করতে পারে।
- আগে এটার নাম ছিল `createReactAgent` এবং `@langchain/langgraph/prebuilt` থেকে আসতো, কিন্তু সেটা এখন deprecated (বাতিল)।

**`import { TavilySearch } from "@langchain/tavily"`**
- Tavily হলো একটা AI-optimized search engine।
- এটা agent এর "tool" হিসেবে কাজ করবে — যখন agent এর internet থেকে তথ্য দরকার হবে, সে এই tool ব্যবহার করবে।

---

### লাইন ৫: Main Function শুরু

```js
async function main() {
```

- `async` মানে এই function এর ভেতরে `await` ব্যবহার করা যাবে।
- AI model call করা, search করা — এগুলো সব asynchronous কাজ (সময় লাগে), তাই `async` লাগবেই।
- পুরো agent এর logic এই function এর ভেতরে আছে।

---

### লাইন ৬-১১: AI Model সেটআপ

```js
const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
});
```

এখানে AI model configure করা হচ্ছে। প্রতিটা option এর মানে:

- **`model: "openai/gpt-oss-120b"`** — কোন AI model ব্যবহার হবে সেটা বলা হচ্ছে। এটা Groq এর মাধ্যমে একটা 120 billion parameter ওপেন সোর্স model চালাচ্ছে।

- **`temperature: 0`** — এটা AI এর "সৃজনশীলতা" নিয়ন্ত্রণ করে।
  - `0` মানে: AI সবসময় সবচেয়ে সম্ভাব্য উত্তর দিবে (deterministic, একই প্রশ্নে একই উত্তর)।
  - `1` মানে: AI বেশি creative/random হবে।
  - এখানে `0` রাখা হয়েছে কারণ আমরা সঠিক, factual উত্তর চাই।

- **`maxTokens: undefined`** — কতটুকু লম্বা উত্তর দিতে পারবে সেটার limit। `undefined` মানে কোনো limit নেই, model যতটুকু চায় ততটুকু লিখতে পারবে।

- **`maxRetries: 2`** — যদি API call fail হয় (network error, server busy ইত্যাদি), তাহলে সর্বোচ্চ ২ বার আবার চেষ্টা করবে।

---

### লাইন ১৩-১৬: Search Tool সেটআপ

```js
const search = new TavilySearch({
    maxResults: 3,
    topic: "general",
});
```

এখানে Tavily Search tool configure করা হচ্ছে:

- **`maxResults: 3`** — প্রতিটা search এ সর্বোচ্চ ৩টা result আনবে। বেশি আনলে সময় বেশি লাগবে, কম আনলে তথ্য কম পাবে। ৩টা একটা ভালো balance।

- **`topic: "general"`** — সার্চের ধরন। `"general"` মানে সব ধরনের বিষয়ে search করতে পারবে। অন্য option হতে পারে `"news"` (শুধু খবর)।

---

### লাইন ১৮-২১: Agent তৈরি

```js
const agent = createAgent({
    model: model,
    tools: [search],
});
```

এটাই সবচেয়ে গুরুত্বপূর্ণ অংশ! এখানে ReAct Agent তৈরি হচ্ছে।

- **`model: model`** — উপরে যে AI model বানানো হলো সেটা agent কে দেওয়া হচ্ছে। এটা agent এর "মস্তিষ্ক" — এটা দিয়ে সে চিন্তা করবে।

- **`tools: [search]`** — agent কে কোন কোন tool ব্যবহার করতে দেওয়া হবে। এখানে শুধু search tool দেওয়া হয়েছে। তুমি চাইলে একাধিক tool দিতে পারো, যেমন calculator, database query ইত্যাদি।

**ReAct Agent কিভাবে কাজ করে (পেছনের ঘটনা):**
1. User এর প্রশ্ন পায়
2. চিন্তা করে (Reasoning): "এই প্রশ্নের উত্তর দিতে আমার কী করা লাগবে?"
3. সিদ্ধান্ত নেয়: "আমার internet search করা লাগবে"
4. Action নেয়: Tavily Search tool ব্যবহার করে search করে
5. Search result দেখে আবার চিন্তা করে
6. যদি আরো তথ্য লাগে, আবার search করে (loop)
7. যখন যথেষ্ট তথ্য পায়, তখন চূড়ান্ত উত্তর দেয়

---

### লাইন ২৩-৩০: Agent কে প্রশ্ন করা

```js
const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "what is the current weather in dhaka ?",
      },
    ],
});
```

- **`agent.invoke()`** — agent কে কাজ করতে বলা হচ্ছে।
- **`await`** — agent এর কাজ শেষ হওয়া পর্যন্ত অপেক্ষা করো (কারণ এটা সময় নেয়)।
- **`messages`** — chat format এ message পাঠানো হচ্ছে।
  - **`role: "user"`** — এই message টা user এর কাছ থেকে আসছে।
  - **`content`** — প্রশ্নটা হলো "ঢাকায় এখন আবহাওয়া কেমন?"

Agent এই প্রশ্ন পেয়ে বুঝবে যে current weather জানতে হলে internet search করা লাগবে, তারপর নিজে Tavily দিয়ে search করে উত্তর দিবে।

**`result` এর ভেতরে কী থাকে:**
```
result = {
  messages: [
    { role: "user", content: "what is the current weather..." },     // তোমার প্রশ্ন
    { role: "assistant", content: "", tool_calls: [...] },            // AI এর tool call
    { role: "tool", content: "search results..." },                   // search result
    { role: "assistant", content: "The weather in Dhaka is..." },     // চূড়ান্ত উত্তর
  ]
}
```

---

### লাইন ৩২-৩৫: উত্তর দেখানো

```js
console.log(
    "Assistant : ",
    result.messages[result.messages.length - 1].content,
);
```

- **`result.messages`** — সব messages এর একটা array (তালিকা)।
- **`result.messages.length - 1`** — array এর সবশেষ item এর index। কারণ array 0 থেকে শুরু হয়, তাই শেষ item এর index হলো `length - 1`।
- **`result.messages[result.messages.length - 1].content`** — শেষ message এর content, যেটা হলো AI এর চূড়ান্ত উত্তর।
- এটা console এ print করবে: `Assistant : The weather in Dhaka is...`

---

### লাইন ৩৮: Function Call

```js
main();
```

- উপরে `main()` function define করা হয়েছে, এখানে সেটা call/execute করা হচ্ছে।
- এই লাইন ছাড়া কিছুই চলবে না — function শুধু define করলেই হয় না, call ও করতে হয়।

---

## সম্পূর্ণ কোডের Flow (প্রবাহ)

```
main() call হলো
    ↓
Groq AI Model তৈরি হলো
    ↓
Tavily Search Tool তৈরি হলো
    ↓
Agent তৈরি হলো (model + tools দিয়ে)
    ↓
Agent কে প্রশ্ন পাঠানো হলো
    ↓
Agent চিন্তা করলো → search দরকার → Tavily দিয়ে search করলো
    ↓
Search result পেয়ে উত্তর তৈরি করলো
    ↓
Console এ উত্তর print হলো
```

---

## প্রয়োজনীয় Environment Variables

এই কোড চালাতে তোমার এই API keys লাগবে:

| Variable | কোথা থেকে পাবে | কেন লাগে |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | Groq এর মাধ্যমে AI model চালানোর জন্য |
| `TAVILY_API_KEY` | [tavily.com](https://tavily.com) | Internet search করার জন্য |

এগুলো `.env` ফাইলে রাখো অথবা terminal এ set করো:
```bash
export GROQ_API_KEY="তোমার-key"
export TAVILY_API_KEY="তোমার-key"
```

---

## চালানোর নিয়ম

```bash
npm install langchain    # নতুন package install করো
node agent.js            # কোড চালাও
```
