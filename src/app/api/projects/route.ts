import { NextRequest, NextResponse } from 'next/server';
import { ProjectResponse } from '../../../types/projects';


/**
 * Get projects list
 * @route GET /api/projects
 * @param {QueryParams} query.query - Query parameters for pagination, sorting, and searching
 * @returns {ProjectResponse} 200 - An array of project objects with pagination info
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

        // Fetching projects from the cdn api
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/v1/api/projects?${strParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const projects = await response.json();
        return NextResponse.json<ProjectResponse>(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}