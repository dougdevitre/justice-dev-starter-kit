/**
 * @module DocumentRoute
 * @description Document generation endpoint.
 * Generates PDF or DOCX documents from templates with user-provided variables.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';
import { generateDocument, getTemplates } from '../../../lib/documents';
import { logAudit, getClientIP } from '../../../lib/audit';

/**
 * POST /api/documents — Generate a document from a template.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const user = await requireAuth(request);
    const { templateId, type, variables } = await request.json();

    if (!templateId || !type) {
      return NextResponse.json(
        { error: 'templateId and type are required' },
        { status: 400 }
      );
    }

    const document = await generateDocument({
      templateId,
      type,
      variables: variables ?? {},
      userId: user.id,
    });

    await logAudit({
      action: 'document_created',
      userId: user.id,
      resource: 'document',
      resourceId: document.id,
      ipAddress: getClientIP(request),
      metadata: { templateId, type },
    });

    return NextResponse.json({
      id: document.id,
      filename: document.filename,
      type: document.type,
      sizeBytes: document.sizeBytes,
      generatedAt: document.generatedAt,
    });
  } catch (error: any) {
    const status = error.status ?? 500;
    return NextResponse.json(
      { error: error.message ?? 'Document generation failed' },
      { status }
    );
  }
}

/**
 * GET /api/documents — List available document templates.
 */
export async function GET(): Promise<Response> {
  const templates = getTemplates();
  return NextResponse.json({ templates });
}
