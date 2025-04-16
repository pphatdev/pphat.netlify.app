import { MagneticArea } from "@components/ui/magnetic-button"
import Image from "next/image"
import Link from "next/link"

export const NavigationBar = () => {
    return (
        <header className="sticky inset-x-0 top-0 z-10 border-b bg-background/5 backdrop-blur-sm border-foreground/5">
            <div className="flex h-14 items-center max-w-5xl mx-auto justify-between gap-8 px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <MagneticArea>
                        <Link href="/" className="shrink-0" aria-label="Home">
                            <Image width={50} height={50} src={'/assets/logo/logo-transparent-dark-mode.png'} alt={"Logo"} className="hidden dark:block" />
                            <Image width={50} height={50} src={'/assets/logo/logo-transparent-light-mode.png'} alt={"Logo"} className="dark:hidden" />
                        </Link>
                    </MagneticArea>
                    {/* <MagneticArea>
                        <ThemeToggle className="scale-90" />
                    </MagneticArea> */}
                </div>

                <div className="flex items-center gap-6 max-md:hidden font-default font-medium">
                    <Link href="/projects" className="text-sm/6 text-gray-950 dark:text-white">Projects</Link>
                    <Link href="#" className="text-sm/6 text-gray-950 dark:text-white">Blogs</Link>
                    {/* <Link href="#" className="group relative px-1.5 text-sm/6 text-primary">
                    <span className="absolute inset-0 border border-dashed border-primary/600 bg-primary/10 group-hover:bg-primary/20"></span>
                    Login
                    <svg width="5" height="5" viewBox="0 0 5 5" className="absolute top-[-2px] left-[-2px] fill-primary/50">
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                    <svg width="5" height="5" viewBox="0 0 5 5" className="absolute top-[-2px] right-[-2px] fill-primary/50">
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                    <svg width="5" height="5" viewBox="0 0 5 5" className="absolute bottom-[-2px] left-[-2px] fill-primary/50">
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                    <svg width="5" height="5" viewBox="0 0 5 5" className="absolute right-[-2px] bottom-[-2px] fill-primary/50">
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                </Link> */}


                    {/* <MagneticArea>
                    <Link aria-label="GitHub repository" href="https://github.com/pphatdev">
                        <svg
                            height="26"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            version="1.1"
                            width="26"
                            fill="currentColor"
                        >
                            <path d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z" />
                        </svg>
                    </Link>
                </MagneticArea> */}

                </div>

                <div className="flex items-center gap-2.5 md:hidden">
                    {/* Mobile menu buttons */}
                </div>
            </div>
        </header>
    )
}