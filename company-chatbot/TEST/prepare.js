import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small'
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
  console.log(texts.length);
}
