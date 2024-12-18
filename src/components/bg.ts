import { BgEffectLeft, BgEffectRight } from "./bg-effect"
import { spaceElevatorSVG } from "./updown"

export const Bg = (element: string = "") => {
    return(`
        <div class="overflow-hidden min-h-screen w-full relative">
            <div class="absolute inset-0 pointer-events-none">
                ${spaceElevatorSVG('h-screen')}
            </div>
            <div class="absolute inset-y-0 left-0 -translate-x-1/2 pointer-events-none">
                ${BgEffectRight}
            </div>
            <div class="absolute inset-y-0 right-0 translate-x-1/2 pointer-events-none">
                ${BgEffectLeft}
            </div>
            ${element}
        </div>
    `)
}