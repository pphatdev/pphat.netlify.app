import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@components/admin/admin-page-header';
import { ProjectEditorForm } from '@components/admin/project-editor-form';
import { getEditableProject } from '@lib/db/admin-content';

interface AdminProjectEditPageProps {
    params: Promise<{ id: string; }>;
}

export default async function AdminProjectEditPage({ params }: AdminProjectEditPageProps) {
    const { id } = await params;
    const project = await getEditableProject(id);

    if (!project) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Edit Project"
                description="Update project details, resources, and publish state."
            />
            <ProjectEditorForm project={project} />
        </div>
    );
}