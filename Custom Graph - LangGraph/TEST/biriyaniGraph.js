import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { writeFileSync } from "node:fs";

/**
 * Cut The Vegetables
 */
let x = 0;

function cutTheVegetables(state) {
  console.log("Cut The Vegetables");
  return state;
}

/**
 * Boil The Rice
 */
function boilTheRice(state) {
  console.log("Boil The Rice");
  return state;
}

/**
 * Add The Salt
 */
function addTheSalt(state) {
  console.log("Add The Salt");
  return state;
}

/**
 * Taste The Biriyani
 */
function tasteTheBiriyani(state) {
  console.log("Taste The Biriyani");
  return state;
}

/**
 * Where to go
 */
function whereToGo() {
  if (x == 1) {
    return "__end__";
  } else {
    x++;
    return "addTheSalt";
  }
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("cutTheVegetables", cutTheVegetables)
  .addNode("boilTheRice", boilTheRice)
  .addNode("addTheSalt", addTheSalt)
  .addNode("tasteTheBiriyani", tasteTheBiriyani)
  .addEdge("__start__", "cutTheVegetables")
  .addEdge("cutTheVegetables", "boilTheRice")
  .addEdge("boilTheRice", "addTheSalt")
  .addEdge("addTheSalt", "tasteTheBiriyani")
  .addConditionalEdges("tasteTheBiriyani", whereToGo, {
    __end__: END,
    addTheSalt: "addTheSalt",
  });

const app = graph.compile();

async function main() {
  // Graph Visualization
  const drawableGraphGraphState = await app.getGraphAsync();
  const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
  const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

  const filePath = "./graphState.png";
  writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));

  // Invoke the Graph
  const finalState = await app.invoke({
    messages: [],
  });

  console.log("final: ", finalState);
}

main();

// import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import { writeFileSync } from "node:fs";

// /**
//  * Cut the vegetables
//  */

// function cutTheVegetables(state) {
//   console.log("Cutting the vegetables....");

//   return state;
// }

// /**
//  * Boil the Rice
//  */

// function boilTheRice(state) {
//   console.log("Boiling the Rice.....");

//   return state;
// }

// /**
//  * Add the salt
//  */

// function addTheSalt(state) {
//   console.log("Adding the salt.....");

//   return state;
// }

// /**
//  * Taste the biriyani
//  */

// function tasteTheBiriyani(state) {
//   console.log("Tasting the Biriyani.....");

//   return state;
// }

// /**
//  * Where to go?
//  */

// function whereToGo() {
//   if (true) {
//     return "__end__";
//   } else {
//     return "addTheSalt";
//   }
// }

// const graph = new StateGraph(MessagesAnnotation)
//   .addNode("cutTheVegetables", cutTheVegetables)
//   .addNode("boilTheRice", boilTheRice)
//   .addNode("addTheSalt", addTheSalt)
//   .addNode("tasteTheBiriyani", tasteTheBiriyani)
//   .addEdge("__start__", "cutTheVegetables")
//   .addEdge("cutTheVegetables", "boilTheRice")
//   .addEdge("boilTheRice", "addTheSalt")
//   .addEdge("addTheSalt", "tasteTheBiriyani")
//   .addConditionalEdges("tasteTheBiriyani", whereToGo, {
//     __end__: END,
//     addTheSalt: "addTheSalt",
//   });

// const biriyaniProcess = graph.compile();

// async function main() {
//   // Graph Visualization
//   const drawableGraphGraphState = await biriyaniProcess.getGraphAsync();
//   const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
//   const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

//   const filePath = "./graphState.png";
//   writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));

//   // Invoke the Graph
//   const finalState = await biriyaniProcess.invoke({
//     messages: [],
//   });

//   console.log("final: ", finalState);
// }

// main();
