import { NextRequest, NextResponse } from 'next/server';

/**
 * Get articles list
 * @route GET /api/articles
 * @param {QueryParams} query.query - Query parameters for pagination, sorting, and searching
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const strParams = new URLSearchParams({
            page: parseInt(searchParams.get('page') || '1', 10).toString(),
            limit: parseInt(searchParams.get('limit') || '10', 10).toString(),
            sort: searchParams.get('sort') || '',
            order: (searchParams.get('order') as 'asc' | 'desc') || '',
            search: searchParams.get('search') || '',
        });

        // Fetching articles from the cdn api
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/v1/api/articles?${strParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const articles = await response.json();
        return NextResponse.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}
