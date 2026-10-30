import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',
  // apiKey: process.env.OPENAI_API_KEY, 
})

const pinecone = new PineconeClient(); 

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME)

const vectorStore = PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
})

export async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false }); // splitPages false kora hoise karon by default PDFLoader pdf er prottekta page ke ekta alada object er vitor pagecontent e rakhe . kintu eta false korle full pdf er sob content ektaii object e rakha hobe .

  const doc = await loader.load();

  //   console.log(doc[0].pageContent);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const texts = await splitter.splitText(doc[0].pageContent);

  const documents = texts.map((chunk) => {
    return {
      pageContent: chunk,
      metadata: doc[0].metadata
    }
  })

  await vectorStore.addDocuments(documents)
  // console.log(documents)
  // console.log(texts.length);
}
