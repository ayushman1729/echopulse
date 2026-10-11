import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const payload = await req.json();
    const { url, method = 'GET', headers = {}, body } = payload;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const fetchHeaders = new Headers();
    Object.entries(headers).forEach(([k, v]) => {
      if (k && v && typeof v === 'string') {
        fetchHeaders.set(k, v);
      }
    });

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      redirect: 'follow',
      cache: 'no-store',
    };

    if (method !== 'GET' && method !== 'HEAD' && body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const timeMs = Date.now() - startTime;

    // Extract headers
    const resHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      resHeaders[key] = value;
    });

    // Extract body and size
    const contentType = response.headers.get('content-type') || '';
    let responseData: any;
    let sizeBytes = 0;

    if (contentType.includes('application/json')) {
      const text = await response.text();
      sizeBytes = new Blob([text]).size;
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    } else {
      const text = await response.text();
      sizeBytes = new Blob([text]).size;
      responseData = text;
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      timeMs,
      sizeBytes,
      headers: resHeaders,
      data: responseData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const timeMs = Date.now() - startTime;
    return NextResponse.json(
      {
        status: 0,
        statusText: 'Network / Client Error',
        timeMs,
        sizeBytes: 0,
        headers: {},
        data: null,
        error: error.message || 'Failed to fetch the target URL',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}
