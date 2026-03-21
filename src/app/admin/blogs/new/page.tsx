import { AdminPageHeader } from '@components/admin/admin-page-header';
import { PostEditorForm } from '@components/admin/post-editor-form';

export default function AdminNewBlogPage() {
    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="New Blog"
                description="Create a new post entry directly in the SQLite content store."
            />
            <PostEditorForm />
        </div>
    );
}