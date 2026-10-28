/** 
 * Implentation Plan 
 * 
 * Stage 1: 
 * 
 * 1. Load the document - PDF, Text
 * 2. Chunk the Document
 * 3. Generate vector embeddings
 * 4. Store the vector embeddings - Vector database
 * 
 * Stage 2: 
 * 
 * 1. Setup LLM
 * 2. Add Retrieval Step
 * 3. Pass input + relevant information to LLM
 * 
 */

import { indexTheDocument } from "./prepare.js";

const filePath = "./cg-internal-docs.pdf"
indexTheDocument(filePath)