import { NextRequest } from 'next/server';
import { getCurrentUser } from '@lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user || !user.backendToken) {
        return new Response('Unauthorized', { status: 401 });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API}/v1/api/dashboard/live-traffic`;

    console.log(`Connecting to backend SSE: ${backendUrl}`);
    const response = await fetch(backendUrl, {
        headers: {
            'Authorization': `Bearer ${user.backendToken}`,
            'Accept': 'text/event-stream',
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        console.error(`Backend SSE connection failed: ${response.status} ${response.statusText}`);
        return new Response(`Failed to connect to traffic stream: ${response.status}`, { status: response.status });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const reader = response.body?.getReader();
            if (!reader) {
                controller.close();
                return;
            }

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    controller.enqueue(value);
                }
            } catch (error: any) {
                // Handle BodyTimeoutError (UND_ERR_BODY_TIMEOUT) gracefully
                if (error.code === 'UND_ERR_BODY_TIMEOUT' || error.message?.includes('terminated')) {
                    console.log('SSE Stream timed out or terminated gracefully');
                } else {
                    console.error('SSE Proxy Error:', error);
                    controller.error(error);
                }
            } finally {
                controller.close();
                reader.releaseLock();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
