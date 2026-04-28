import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { appName, NEXT_PUBLIC_APP_URL } from '@lib/constants';
import { NavigationBar } from '@components/navbar/navbar';
import { GridPattern } from '@components/ui/grid-pattern';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import "../../../styles/code-block-node.css"
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { ArrowLeftIcon, ArrowRightIcon, Calendar, Clock, User } from 'lucide-react';
import BreadcrumbStructuredData from '@components/breadcrumb-structured-data';
import SoftwareApplicationStructuredData from '@components/data-structured/software-application';
import { MarkdownRenderer } from '@components/ui/markdown-renderer';
import { ScrollToTopButton } from '@components/ui/scroll-to-top-button';
import { PostCoverImage } from '@components/ui/post-cover-image';
import { DividerVerticalIcon } from '@radix-ui/react-icons';
import Footer from 'src/components/layouts/footer';
import { ProjectDetailResponse } from '../../../types/projects';
import { Metadata } from 'next';
import { headers } from 'next/headers';

interface Params {
    params: {
        slug: string;
    };
}


export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const project = await getProjectDetail(params.slug);
    const data = project?.data;

    if (!project) {
        return {
            title: `Project Not Found`,
            description: 'The requested project could not be found',
        };
    }

    return {
        title: `${data.title}`,
        description: data.description,
        authors: data.contributors?.map((author) => ({
            name: author.name,
            url: author.url,
        })) || [{
            name: appName,
            url: NEXT_PUBLIC_APP_URL,
        }],
        openGraph: {
            title: `${data.title}`,
            description: data.description,
            type: 'website',
            url: `${NEXT_PUBLIC_APP_URL}/projects/${data.slug}`,
            images: data.thumbnail ? [{ url: data.thumbnail.toString() }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${data.title}`,
            description: data.description,
            images: data.thumbnail ? [{ url: data.thumbnail.toString() }] : undefined,
        },
    };
}


const getBaseUrl = async () => {
    const headerStore = await headers();
    const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";

    if (!host) {
        return NEXT_PUBLIC_APP_URL;
    }

    return `${protocol}://${host}`;
};

const getProjectDetail = async (slug: string): Promise<ProjectDetailResponse> => {
    try {
        const baseUrl = await getBaseUrl();
        const endpoint = new URL(`/api/projects/${slug}`, baseUrl).toString();
        const response = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.error(`Failed to fetch project with slug ${slug}:`, response.statusText);
            throw new Error(`Failed to fetch project with slug ${slug}`);
        }

        const data = await response.json();
        return data as ProjectDetailResponse;
    }
    catch (error) {
        console.error(`Error fetching project with slug ${slug}:`, error);
        throw error;
    }
};



export default async function ProjectDetail(props: Params) {
    const params = await props.params;
    const project = await getProjectDetail(params.slug);
    const data = project.data;


    if (!project) {
        return (
            <>
                <GridPattern width={30} height={30} x={-1} y={-1} className={'mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] '} />
                <NavigationBar className='sticky' />

                <div className='container flex min-h-svh flex-col justify-center items-center mx-auto py-16 text-center'>
                    <h1 className='text-4xl font-bold mb-4'>Project Not Found</h1>
                    <p className='text-muted-foreground mb-8'> The project you are looking for does not exist. </p>

                    <Button asChild className='ring'>
                        <Link href='/projects'>
                            <ArrowLeftIcon className='w-4 h-4 mr-2' /> Back to Projects
                        </Link>
                    </Button>
                </div>
            </>
        );
    }



    return (
        <>
            <SoftwareApplicationStructuredData
                name={data.title}
                description={data.description}
                url={`/projects/${data.slug}`}
                // repositoryUrl={data.source?.find((item) => item.type === 'source')?.url}
                screenshots={[data.thumbnail ? data.thumbnail.toString() : '']}
                datePublished={data.createdAt}
                keywords={[
                    ...(data.tags ?? []).map((tag) => tag.tag),
                    ...(data.languages ?? []).map((language) => language.name),
                ]}
            />

            <BreadcrumbStructuredData
                items={[
                    { name: 'Home', url: NEXT_PUBLIC_APP_URL, position: 1 },
                    { name: 'Projects', url: `${NEXT_PUBLIC_APP_URL}/projects`, position: 2 },
                    { name: data.title, url: `${NEXT_PUBLIC_APP_URL}/projects/${data.slug}`, position: 3 },
                ]}
            />

            <NavigationBar className='fixed' />

            <div className='absolute inset-y-0 left-0 right-0 pointer-events-none opacity-60' aria-hidden='true'>
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={'mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] '}
                />
            </div>

            <article className='max-w-5xl sm:px-4 relative mx-auto max-xs:pt-0 sm:mt-16 py-8'>
                {data.thumbnail && (
                    <div className='relative w-full sm:p-2 ring-1 rounded-3xl ring-foreground/10 h-full max-xs:max-h-96 md:h-116 max-xs:rounded-none max-xs:rounded-b-4xl overflow-hidden'>
                        <PostCoverImage src={data.thumbnail} alt={data.title} />
                    </div>
                )}

                <div className='flex items-center justify-between gap-2 max-sm:px-3 py-4 order-2'>
                    <Button asChild className='mt-0 rounded-xl h-8'>
                        <Link href='/projects'>
                            <ArrowLeftIcon className='w-4 h-4' /> Back
                        </Link>
                    </Button>

                    {/* <div className='flex justify-end items-center py-4 gap-2 flex-wrap'>
                        {(data.languages ?? []).map((source) => (
                            <Button asChild key={`${source.type}-${source.url}`} className='mt-0 border'>
                                <Link href={source.url} target='_blank' rel='noopener noreferrer'>
                                    {source.type === 'demo' ? (
                                        <ExternalLink className='w-4 h-4' />
                                    ) : (
                                        <Globe className='w-4 h-4' />
                                    )}
                                    {source.name || (source.type === 'demo' ? 'Live Demo' : 'Source Code')}
                                </Link>
                            </Button>
                        ))}
                    </div> */}
                </div>

                <div className='flex px-3 xs:px-0 gap-2 flex-wrap items-center mb-4 justify-between'>
                    {(data.languages?.length || 0) > 0 && (
                        <div className='flex w-fit justify-center rounded-full p-0.5 sm:p-1 ring-1 ring-foreground/10 gap-1 bg-background'>
                            {(data.languages ?? []).map((language) => (
                                <Badge key={language.id} variant='outline' className="py-1"> {language.name} </Badge>
                            ))}
                        </div>
                    )}

                    {(data.tags?.length || 0) > 0 && (
                        <div className='flex w-fit justify-center border p-0.5 sm:p-1 rounded-full gap-1 bg-background'>
                            {(data.tags ?? []).map((tag) => (
                                <Badge key={tag.id} variant='default' className='py-1 leading-tight font-open-sans'> @{tag.tag} </Badge>
                            ))}
                        </div>
                    )}
                </div>


                <div className="max-sm:p-3 py-2 border-y border-foreground/10">
                    {/* <div className="2xl:before:hidden py-2 max-xs:px-3 2xl:after:hidden relative before:absolute before:top-0 before:h-px before:w-[200vw] before:bg-gray-950/5 dark:before:bg-white/10 before:-left-[100vw] after:absolute after:bottom-0 after:h-px after:w-[200vw] after:bg-gray-950/5 dark:after:bg-white/10 after:-left-[100vw]"> */}
                    {data.createdAt && (
                        <div className='flex items-center justify-start'>
                            <div className='flex items-center space-x-1 max-sm:text-xs text-sm text-muted-foreground'>
                                <Calendar className='size-4' />
                                <time dateTime={data.createdAt} className='whitespace-nowrap'>
                                    {new Date(data.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                            </div>

                            <DividerVerticalIcon orientation='vertical' className='mx-1 text-foreground/50 h-4' />

                            <div className='flex items-center space-x-1 max-sm:text-xs text-sm text-muted-foreground whitespace-nowrap'>
                                <Clock className='w-4 h-4' />
                                <span>{formatDistanceToNow(new Date(data.createdAt))} ago</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className='max-sm:px-3 flex flex-col relative order-1 mb-4'>
                    <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
                        <span className="text-left bg-background  bg-clip-text bg-no-repeat text-transparent bg-linear-to-r  from-sky-500 via-teal-500 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]"> {data.title} </span>
                    </h1>
                    <p className='text-base text-foreground/80 mt-3 leading-relaxed font-sans'>{data.description}</p>
                </div>

                <ul className="p-2 border-y flex items-start">
                    {(data.contributors ?? []).map((author, index) => (
                        <li key={index} className='flex items-center'>
                            <Link
                                rel='noopener noreferrer'
                                target='_blank'
                                href={author.url === '' ? String(author.profile).replace('.png', '') : author.url}
                                key={index}
                                className='flex items-center space-x-2'
                            >
                                <Avatar className='w-8 h-8'>
                                    <AvatarImage src={author.profile} alt={author.name} />
                                    <AvatarFallback>
                                        <User className='w-4 h-4' />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='text-sm'>
                                    <p className='font-medium'>{author.name}</p>
                                </div>
                            </Link>
                            {index < (data.contributors?.length ?? 0) - 1 && (
                                <DividerVerticalIcon orientation='vertical' className='mx-1 text-foreground/50 h-4' />
                            )}
                        </li>
                    ))}
                </ul>

                <div className='py-5'>
                    <div className='mx-auto max-xs:px-3'>
                        <MarkdownRenderer content={data.details.content} />
                    </div>

                    <div className='flex flex-col gap-3 max-xs:px-3 mt-10'>
                        <div className='flex items-center mx-auto justify-between w-full gap-3'>
                            {project.navigation.prev ? (
                                <Button asChild>
                                    <Link href={`/projects/${project.navigation.prev}`}>
                                        <ArrowLeftIcon className='w-4 h-4 mr-2 shrink-0' />
                                        <span className='sm:hidden'>Prev</span>
                                    </Link>
                                </Button>
                            ) : ( <div /> )}

                            {project.navigation.next ? (
                                <Button asChild>
                                    <Link href={`/projects/${project.navigation.next}`}>
                                        <span className='sm:hidden'>Next</span>
                                        <ArrowRightIcon className='w-4 h-4 ml-2 shrink-0' />
                                    </Link>
                                </Button>
                            ) : ( <div /> )}
                        </div>
                    </div>
                </div>

            </article>

            <Footer />

            <ScrollToTopButton />
        </>
    );
}