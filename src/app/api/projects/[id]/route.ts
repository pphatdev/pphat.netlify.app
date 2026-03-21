import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, getProjectBySlug } from '@lib/content';
import { requireUserSession } from '@lib/auth';
import { deleteProjectRecord, updateProjectRecord } from '@lib/db/admin-content';

interface Params {
    params: Promise<{ id: string; }>;
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const allProjects = await getAllProjects();
        const project = await getProjectBySlug(params.id) ?? allProjects.find((entry) => entry.id === params.id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const updatedProject = await updateProjectRecord(params.id, body);

        if (!updatedProject) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project updated successfully', data: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, props: Params) {
    return PUT(request, props);
}

export async function DELETE(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const session = await requireUserSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const deleted = await deleteProjectRecord(params.id);
        if (!deleted) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project deleted successfully', success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}