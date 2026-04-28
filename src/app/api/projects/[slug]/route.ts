import { NextRequest, NextResponse } from 'next/server';
import { ProjectDetailResponse } from '../../../../types/projects';

interface Params {
    params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, props: Params) {
    try {
        const params = await props.params;
        const slug = params.slug;

        const apiUrl = `${process.env.NEXT_PUBLIC_API}/v1/api/projects/${slug}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            return new Response(JSON.stringify({ error: `Failed to fetch project: ${response.statusText}` }), { status: response.status });
        }
        const projectData = await response.json();
        return NextResponse.json<ProjectDetailResponse>(projectData);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        return new Response(JSON.stringify({ error: 'An error occurred while fetching the project.' }), { status: 500 });
    }
}