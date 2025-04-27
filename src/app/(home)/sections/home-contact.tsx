import { Title } from "@components/ui/title"

export const HomeContact = () => {
    const title = ["Contact", "me"]
    const description = "I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision."
    return (
        <section id="section-contact" className="max-w-5xl flex flex-col items-center justify-start min-h-screen mx-auto">
            <div className="p-8 pt-24">
                <Title as='h2' title={title} description={description} />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    {/* Add your contact cards here */}
                </div>
            </div>
        </section>
    )
}