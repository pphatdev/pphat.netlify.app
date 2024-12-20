import { cn } from "@/utils/tailwind-merge"
import TweenLite, { Linear } from 'gsap';


export const spaceElevatorSVG = (className?: string) => {
    return (`
        <svg class="${cn("w-full h-full", className)}" id="lines" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewbox="0 0 1920 1080" xml:space="preserve" preserveAspectRatio="none">
            <g class="opacity-10">
                <rect class="fill-primary/10" x="1253.6" width="4.5" height="1080"></rect>
                <rect class="fill-primary/10" x="873.3" width="1.8" height="1080"></rect>
                <rect class="fill-primary/10" x="1100" width="1.8" height="1080"></rect>
                <rect class="fill-primary/10" x="1547.1" width="4.5" height="1080"></rect>
                <rect class="fill-primary/10" x="615" width="4.5" height="1080"></rect>
                <rect class="fill-primary/10" x="684.6" width="1.8" height="1080"></rect>
                <rect class="fill-primary/10" x="1369.4" width="1.8" height="1080"></rect>
                <rect class="fill-primary/10" x="1310.2" width="0.9" height="1080"></rect>
                <rect class="fill-primary/10" x="1233.4" width="0.9" height="1080"></rect>
                <rect class="fill-primary/10" x="124.2" width="0.9" height="1080"></rect>
                <rect class="fill-primary/10" x="1818.4" width="4.5" height="1080"></rect>
                <rect class="fill-primary/10" x="70.3" width="4.5" height="1080"></rect>
                <rect class="fill-primary/10" x="1618.6" width="1.8" height="1080"></rect>
                <rect class="fill-primary/10" x="455.9" width="1.8" height="1080"></rect>
                <rect class="fill-primary/10" x="328.7" width="1.8" height="1080"></rect>
                <rect class="fill-primary/10" x="300.8" width="4.6" height="1080"></rect>
                <rect class="fill-primary/10" x="1666.4" width="0.9" height="1080"></rect>
            </g>
            <g class="opacity-20">
                <path class="light1 fill-primary" d="M619.5,298.4H615v19.5h4.5V298.4z M619.5,674.8H615v9.8h4.5V674.8z M619.5,135.1H615v5.6h4.5V135.1z         M619.5,55.5H615v68.7h4.5V55.5z"></path>
                <path class="light2 fill-primary" d="M1258.2,531.9h-4.5v8.1h4.5V531.9z M1258.2,497.9h-4.5v17.9h4.5V497.9z M1258.2,0h-4.5v25.3h4.5V0z         M1258.2,252.2h-4.5v42.4h4.5V252.2z"></path>
                <path class="light3 fill-primary" d="M875.1,123.8h-1.8v4h1.8V123.8z M875.1,289.4h-1.8v24.1h1.8V289.4z M875.1,0h-1.8v31.4h1.8V0z M875.1,50.2         h-1.8v11.5h1.8V50.2z"></path>
                <path class="light4 fill-primary" d="M1101.8,983.8h-1.8v8.2h1.8V983.8z M1101.8,1075.9h-1.8v4.1h1.8V1075.9z M1101.8,873.7h-1.8v4.2h1.8V873.7z         M1101.8,851h-1.8v18.2h1.8V851z"></path>
                <path class="light5 fill-primary" d="M686.4,822.7h-1.8v3.8h1.8V822.7z M686.4,928.4h-1.8v23h1.8V928.4z M686.4,1043.8h-1.8v36.2h1.8V1043.8z"></path>
                <path class="light6 fill-primary" d="M1551.6,860.9h-4.4v-34.1h4.4V860.9z M1551.6,533.5h-4.4v-13.9h4.4V533.5z M1551.6,1080h-4.4v-89.1h4.4V1080z"></path>
                <path class="light7 fill-primary" d="M1311.1,707.7h-0.9V698h0.9V707.7z M1311.1,436.8h-0.9v-58.9h0.9V436.8z M1311.1,140.7h-0.9V48h0.9V140.7z"></path>
                <path class="light8 fill-primary" d="M125.1,514.5h-0.9v-9.7h0.9V514.5z M125.1,243.6h-0.9v-58.9h0.9V243.6z"></path>
                <path class="light9 fill-primary" d="M305.4,806.7h-4.6v-42.5h4.6V806.7z M305.4,398.5h-4.6v-17.3h4.6V398.5z M305.4,1080h-4.6V968.8h4.6V1080z"></path>
                <path class="light10 fill-primary" d="M1822.9,170.7h-4.5v13.7h4.5V170.7z M1822.9,435.1h-4.5v6.8h4.5V435.1z M1822.9,55.9h-4.5v4h4.5V55.9z         M1822.9,0h-4.5v48.3h4.5V0z"></path>
                <path class="light11 fill-primary" d="M1666.4,331.5h0.9v9.7h-0.9V331.5z M1666.4,602.4h0.9v58.9h-0.9V602.4z M1666.4,898.5h0.9v92.7h-0.9V898.5z"></path>
                <path class="light12 fill-primary" d="M1620.4,200.7h-1.8v6.4h1.8V200.7z M1620.4,469.1h-1.8v39h1.8V469.1z M1620.4,0h-1.8v51h1.8V0z M1620.4,81.3         h-1.8V100h1.8V81.3z"></path>
                <path class="light13 fill-primary" d="M74.8,201h-4.5v16.2h4.5V201z M74.8,512.3h-4.5v8.1h4.5V512.3z M74.8,65.8h-4.5v4.6h4.5V65.8z M74.8,0h-4.5         v56.8h4.5V0z"></path>
                <path class="light14 fill-primary" d="M1371.2,655.3h-1.8v6.3h1.8V655.3z M1371.2,829.7h-1.8v37.9h1.8V829.7z M1371.2,1020.3h-1.8v59.7h1.8V1020.3z"></path>
                <path class="light15 fill-primary" d="M1234.3,898.1h-0.9v-4.9h0.9V898.1z M1234.3,762.5h-0.9v-29.5h0.9V762.5z M1234.3,614.4h-0.9v-46.4h0.9V614.4z         "></path>
                <path class="light16 fill-primary" d="M457.7,1010.8h-1.8v-18.1h1.8V1010.8z M457.7,507.5h-1.8V398h1.8V507.5z"></path>
                <path class="light17 fill-primary" d="M330.5,170.7h-1.8v13.7h1.8V170.7z M330.5,435.1h-1.8v6.8h1.8V435.1z M330.5,55.9h-1.8v4h1.8V55.9z M330.5,0         h-1.8v48.3h1.8V0z"></path>
            </g>
        </svg>
    `)
}

function animateWithRandomNumber(myClass: gsap.TweenTarget, from: number, to: number) {
    TweenLite.fromTo(myClass, Math.floor((Math.random() * 20) + 1), { y: from }, {
        y: to,
        onComplete: animateWithRandomNumber,
        onCompleteParams: [myClass, from, to],
        ease: Linear.easeNone
    });
}


export const renderUpDown = (): void => {
    const svg = document.querySelector('#lines');
    if (svg) {
        [".light4", ".light5", ".light6", ".light7", ".light8", ".light11", ".light12", ".light13", ".light14", ".light15", ".light16"].forEach(e => animateWithRandomNumber(e, -1080, 1080));
        [".light1", ".light2", ".light3", ".light9", ".light10", ".light17"].forEach(e => animateWithRandomNumber(e, 1080, -1080));
    }
}
