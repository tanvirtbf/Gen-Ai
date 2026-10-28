import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });

  const doc = await loader.load();

//   console.log(doc[0].pageContent);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const texts = await (await splitter.splitText(doc[0].pageContent))

  console.log(texts.length)
}
