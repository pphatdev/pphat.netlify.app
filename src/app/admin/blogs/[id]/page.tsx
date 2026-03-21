import { notFound } from 'next/navigation';
import { AdminPageHeader } from '@components/admin/admin-page-header';
import { PostEditorForm } from '@components/admin/post-editor-form';
import { getEditablePost } from '@lib/db/admin-content';

interface AdminBlogEditPageProps {
    params: Promise<{ id: string; }>;
}

export default async function AdminBlogEditPage({ params }: AdminBlogEditPageProps) {
    const { id } = await params;
    const post = await getEditablePost(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="Edit Blog"
                description="Update content, metadata, and publish state for this blog entry."
            />
            <PostEditorForm post={post} />
        </div>
    );
}