/**
 * @module documents
 * @description PDF and DOCX document generation helpers.
 * Provides template-based document generation for court filings
 * and legal documents.
 */

import { v4 as uuid } from 'uuid';
import type { DocumentRequest, DocumentType } from '../types';

/** Generated document result */
export interface GeneratedDocument {
  id: string;
  filename: string;
  type: DocumentType;
  sizeBytes: number;
  buffer: Buffer;
  generatedAt: string;
}

/**
 * Generate a document from a template.
 *
 * @param request - Document generation request with template and variables
 * @returns The generated document
 */
export async function generateDocument(
  request: DocumentRequest
): Promise<GeneratedDocument> {
  const id = uuid();

  // In production, use pdfkit for PDF or docx library for DOCX
  const buffer = Buffer.from(`[Generated ${request.type} document]`);

  return {
    id,
    filename: `${request.templateId}-${id}.${request.type}`,
    type: request.type,
    sizeBytes: buffer.length,
    buffer,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * List available document templates.
 */
export function getTemplates(): Array<{ id: string; name: string; type: DocumentType }> {
  return [
    { id: 'motion-to-modify', name: 'Motion to Modify Custody', type: 'pdf' },
    { id: 'fee-waiver', name: 'Fee Waiver Application', type: 'pdf' },
    { id: 'declaration', name: 'Declaration Under Penalty of Perjury', type: 'docx' },
    { id: 'stipulation', name: 'Stipulation and Order', type: 'pdf' },
  ];
}
