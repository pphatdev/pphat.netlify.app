import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
    try {
        const params = await props.params;
        const slug = params.slug;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/v1/api/articles/${slug}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch article' }, { status: response.status });
        }

        const article = await response.json();
        return NextResponse.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}
