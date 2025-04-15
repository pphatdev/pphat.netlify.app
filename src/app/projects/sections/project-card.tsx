import { Badge } from "@components/ui/badge";
import { Project } from "./interfaces";
import Link from "next/link";
import {ExternalLinkIcon, GlobeIcon} from "@radix-ui/react-icons";
import { AvatarCircles } from '../../../components/ui/avatar-circles';

export const ProjectCard = ({ project }: { project: Project }) => {
    const avatars = project.authors.map((author) => ({
        imageUrl: author.profile,
        profileUrl: author.url,
        title: author.name,
    }));

    return (
        <div
            className="col-span-1 relative duration-300 hover:translate-y-1 overflow-hidden bg-foreground/5 group font-default rounded-2xl p-4 mb-4 ring-1 ring-foreground/10 hover:ring-primary hover:ring-2 transition-all ease-in-out flex flex-col h-full"
            role="article"
            tabIndex={-1}>
            <header className='mb-2 relative flex justify-between items-center'>

                <div className="flex gap-2 items-center">
                    {(project?.languages ?? []).slice(0,2).map((language, index) => (
                        <Badge key={index} className="font-aladin">{language}</Badge>
                    ))}
                </div>

                <div className='bg-foreground/5 ring-1 w-fit ml-auto ring-foreground/10 justify-end flex rounded-full p-1'>
                    {project.source.map((source, index) => (
                        <Link
                            key={index}
                            href={source.url}
                            className="flex rounded-full p-2 hover:ring ring-foreground/20 hover:bg-foreground/10 transition-all items-center justify-center">
                            {source.type === 'demo' && <ExternalLinkIcon className="size-4" />}
                            {source.type === 'source' && <GlobeIcon className="size-4" />}
                        </Link>
                    ))}
                </div>
            </header>

            <h2 className="text-lg z-10 font-semibold font-default tracking-wide line-clamp-1 pb-1">{project.title}</h2>

            <div className="flex z-10 flex-wrap gap-2 my-2">
                {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border border-primary/50">{tag}</Badge>
                ))}
            </div>

            <p className='font-normal z-10 line-clamp-4 text-foreground/80'>{project.description}</p>

            <footer className="mt-auto flex justify-between pt-2 z-10">
                <div className='bg-foreground/5 ring-1 w-fit ring-foreground/10 justify-end flex ga rounded-full p-1'>
                    <AvatarCircles numPeople={avatars.length - 3} avatarUrls={avatars}/>
                </div>
            </footer>
        </div>
    );
};
