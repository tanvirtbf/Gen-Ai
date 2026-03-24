import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

// Flow : prothome document jetar moddhe companyr data thake seta hote pare pdf or onno kono format e sei documents chunk chunk kore vag kore nite hobe. karon ami chai jokhon jeta chauya hobe tokhon sei chunk retrieval er somoy pathano hobe. then chunk kora data ke aro 2 ta phase diye jaite hoy . 1. embeddings and 2. store into vector database . kintu ai 2 ta phase langchain use kore korle se nijeii behind the scena kore fele . then sei vector store theke data retrieve er somoy pathano hoy . 

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  // dimensions: 1536, // this is optional
}); // ekhane api key deya jay . jemon new OpenAIEmbeddings({ apiKey: ..}) . kintu jodi na dei tahole behind the scene automatic .env theke api key niye ney but shorto hocche name exactly rakhte hobe eta : "OPENAI_API_KEY"

const pinecone = new PineconeClient(); // ekhane api key deya jay . jemon new PineconeClient({ apiKey: ..}) . kintu jodi na dei tahole behind the scene automatic .env theke api key niye ney but shorto hocche name exactly rakhte hobe eta : "PINECONE_API_KEY"

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5, // max eksathe 5 ta thread parallel vabe pinecode e data pathabe or kaj korbe
});
export async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });

  const doc = await loader.load();
  //   console.log("doc", doc[0].pageContent);

  const textsplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const texts = await textsplitter.splitText(doc[0].pageContent);

  const documents = texts.map((chunk) => {
    return new Document({
      pageContent: chunk,
      metadata: doc[0].metadata,
    });
  });

  // Data retrieve
  await vectorStore.addDocuments(documents);

  // For all data remove
  // await pineconeIndex.namespace("").deleteAll();

  // console.log("documents : ", documents.length);
}
