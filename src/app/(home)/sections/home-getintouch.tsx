import { Button } from "@components/ui/button";
import { appName, appPositions } from "@lib/constants";

export const GetInTouchSections = () => {
    return (
        <div className="relative z-20 mx-auto grid w-full mt-20 overflow-clip max-w-5xl grid-cols-1 justify-start bg-gradient-to-br from-background via-foreground/10 md:grid-cols-3">
            {/* Horizontal lines */}
            <div
                style={{
                    '--background': '#ffffff',
                    '--color': 'rgba(0, 0, 0, 0.2)',
                    '--height': '1px',
                    '--width': '5px',
                    '--fade-stop': '90%',
                    '--offset': '200px',
                    '--color-dark': 'rgba(255, 255, 255, 0.2)',
                    maskComposite: 'exclude'
                } as React.CSSProperties}
                className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] top-0"
            />
            <div
                style={{
                    '--background': '#ffffff',
                    '--color': 'rgba(0, 0, 0, 0.2)',
                    '--height': '1px',
                    '--width': '5px',
                    '--fade-stop': '90%',
                    '--offset': '200px',
                    '--color-dark': 'rgba(255, 255, 255, 0.2)',
                    maskComposite: 'exclude'
                } as React.CSSProperties}
                className="absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))] bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] bottom-0 top-auto"
            />

            {/* Vertical lines */}
            {['left', 'right'].map((position, index) => (
                <div
                    key={position}
                    style={{
                        '--background': '#ffffff',
                        '--color': 'rgba(0, 0, 0, 0.2)',
                        '--height': '5px',
                        '--width': '1px',
                        '--fade-stop': '90%',
                        '--offset': '80px',
                        '--color-dark': 'rgba(255, 255, 255, 0.2)',
                        maskComposite: 'exclude'
                    } as React.CSSProperties}
                    className={`absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)] bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)] [background-size:var(--width)_var(--height)] [mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)] [mask-composite:exclude] z-30 dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)] ${position === 'right' ? 'left-auto right-0' : 'left-0'}`}
                />
            ))}

            {/* Content */}
            <div className="p-8 md:col-span-2 md:p-14">
                <h2 className="text-left text-2xl font-medium tracking-tight text-foreground/70 md:text-4xl">
                    {`Let's build your website today!`} &nbsp; <br className="hidden md:block" />
                    <span className="font-bold text-primary font-open-sans">Get in touch.</span>
                </h2>
                <p className="mt-4 max-w-lg text-left text-base font-normal tracking-tight text-neutral-500 dark:text-neutral-200 md:text-base">
                    {`Contact us and we will get back within 24 hours. We mean it. You saw the testimonials, right?`}
                </p>
                <div className="flex flex-col items-start sm:flex-row sm:items-center sm:gap-4">
                    <div className="mt-6 flex justify-center">
                        <Button className="rounded-full cursor-pointer" asChild>
                            <a href="/contact">Contact us</a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Testimonial */}
            <div className="border-t border-dashed p-8 md:border-l md:border-t-0 md:p-14">
                <p className="text-base text-neutral-700 dark:text-neutral-200">
                    {`Contact us and we will get back within 24 hours. We mean it. You saw the testimonials, right?`}
                </p>
                <div className="mt-4 flex flex-col items-start gap-1 text-sm">
                    <p className="font-black text-primary uppercase">{appName}</p>
                    <p className="text-foreground/60 font-medium font-sans">{String(appPositions).replace(/\.\,\s*/g, ', ')}</p>
                </div>
            </div>
        </div>
    );
};

export default GetInTouchSections;