import { AdminPageHeader } from '@components/admin/admin-page-header';
import { ProjectEditorForm } from '@components/admin/project-editor-form';

export default function AdminNewProjectPage() {
    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="New Project"
                description="Create a new project entry backed directly by the SQLite database."
            />
            <ProjectEditorForm />
        </div>
    );
}