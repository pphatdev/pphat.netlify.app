'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { FloatingNav } from './ui/floating-navbar';
import { IconHome, IconMessage, IconUser } from '@tabler/icons-react';

const Providers = ({ children }: { children: React.ReactNode }) => {

    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "About",
            link: "/?",
            icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Contact",
            link: "/?",
            icon: (
                <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
            ),
        },
    ];

    return (
        <>
            <FloatingNav navItems={navItems} />
            {children}
            <ProgressBar
                height="4px"
                color="#fffd00"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default Providers;