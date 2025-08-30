import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse incoming request body
        const body = await request.json();

        // Basic validation for required fields
        const requiredFields = [
            'title', 'slug', 'content', 'excerpt', 'author_id',
            'category_id', 'published', 'published_date', 'featured_image',
            'meta_title', 'meta_description', 'meta_keywords',
            'is_featured', 'view_count', 'tags'
        ];
        const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Forward the request to the external API
        const apiResponse = await fetch('https://api.pphatdev.workers.dev/v1/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Parse the response from the external API
        const data = await apiResponse.json();

        // Return the response from the external API
        return NextResponse.json(data, { status: apiResponse.status });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
        );
    }
}