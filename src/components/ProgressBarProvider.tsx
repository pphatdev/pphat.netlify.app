'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const Providers = ({ children }: { children: React.ReactNode }) => {

    // const navItems = [
    //     {
    //         name: "Home",
    //         link: "/",
    //         icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    //     },
    //     {
    //         name: "About",
    //         link: "/?",
    //         icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    //     },
    //     {
    //         name: "Contact",
    //         link: "/?",
    //         icon: (
    //             <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
    //         ),
    //     },
    // ];

    return (
        <>
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