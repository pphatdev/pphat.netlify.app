// import { Event, GlobalEvents } from "@/assets/icons/logo-events";
import { handleThemeToggle } from "@/components/theme";
import { renderUpDown } from "@/components/updown";
import { Routes } from "@/types/router";
import NotFound from "@/pages/not-found/page";
// import { Snow } from "@/components/snow";

export class Router {
    private routes: Routes;

    constructor(routes: Routes) {
        this.routes = routes;
        this.init();
    }

    private init() {
        window.addEventListener('popstate', () => {
            this.loadRoute(location.pathname);
        });
        this.loadRoute(location.pathname);
    }

    private async loadRoute(route: string) {

        const matchedRoute = this.routes.find(r => {
            return r.path === route || /\/:/g.test(r.path)
        });
        if (matchedRoute) {
            const component = typeof matchedRoute.component === 'function'
                ? matchedRoute.component()
                : matchedRoute.component;
            document.getElementById('app')!.innerHTML = await component;
        } else {
            document.getElementById('app')!.innerHTML = NotFound();
        }
        document.head.innerHTML += (`
            <link rel="canonical" href="${window.location.href}"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <link rel="icon" href="/assets/icons/favicon.ico" type="image/x-icon"/>
            <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png"/>
        `)
        handleThemeToggle()
        renderUpDown()
    }

    public async navigate(path: string) {
        history.pushState({}, '', path);
        await this.loadRoute(path);
    }
}
