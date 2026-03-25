/**
 * @example Adding a New Feature to the Starter Kit
 * @description Step-by-step guide to extending the starter kit with a new
 * feature, including API route, service layer, and audit logging.
 */

/*
 * GUIDE: Adding a "Case Notes" Feature
 *
 * Step 1: Define types in src/types/index.ts
 * ──────────────────────────────────────────
 */

// Add to src/types/index.ts:
interface CaseNote {
  id: string;
  caseId: string;
  userId: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

/*
 * Step 2: Create service layer in src/lib/case-notes.ts
 * ─────────────────────────────────────────────────────
 */

// src/lib/case-notes.ts
import { v4 as uuid } from 'uuid';
// import { DatabaseClient } from './database';
// import { logAudit } from './audit';

export async function createNote(
  caseId: string,
  userId: string,
  content: string,
  isPrivate: boolean = false
): Promise<CaseNote> {
  const note: CaseNote = {
    id: uuid(),
    caseId,
    userId,
    content,
    isPrivate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to database
  // const db = new DatabaseClient();
  // await db.put('case_notes', note.id, note);

  // Log to audit trail
  // await logAudit({
  //   action: 'document_created',
  //   userId,
  //   resource: 'case_note',
  //   resourceId: note.id,
  //   metadata: { caseId, isPrivate },
  // });

  return note;
}

/*
 * Step 3: Create API route in src/app/api/notes/route.ts
 * ─────────────────────────────────────────────────────
 */

// src/app/api/notes/route.ts
// import { NextResponse } from 'next/server';
// import { requireAuth } from '@/lib/auth';
// import { createNote } from '@/lib/case-notes';
//
// export async function POST(request: Request) {
//   const user = await requireAuth(request);
//   const { caseId, content, isPrivate } = await request.json();
//   const note = await createNote(caseId, user.id, content, isPrivate);
//   return NextResponse.json(note, { status: 201 });
// }

/*
 * Step 4: Add tests in __tests__/case-notes.test.ts
 * ────────────────────────────────────────────────
 *
 * Follow the patterns in existing test files.
 * Test: creation, authorization, audit logging, privacy.
 */

console.log('See the guide above for step-by-step instructions.');
