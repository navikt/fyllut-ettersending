import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { FyllutEttersendingQueryParams, validateQueryParams } from './utils/queryParams';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const validation = validateQueryParams(queryParams as FyllutEttersendingQueryParams);
  if (!validation.success) {
    return new NextResponse('Invalid query parameters', { status: 400 });
  }
  return NextResponse.next();
}
