const currentPath = window.location.pathname;

export const menu = [
    {
        title: "Home",
        url: "/",
        isActive: currentPath === "/"
    },
    {
        title: "Blog",
        url: "/blog",
        isActive: currentPath === "/blog"
    },
    {
        title: "Projects",
        url: "https://leatsophat.me/projects",
        isActive: currentPath === "/projects"
    },
    {
        title: "About us",
        url: "https://leatsophat.me/about/",
        isActive: currentPath === "/about"
    },
]
