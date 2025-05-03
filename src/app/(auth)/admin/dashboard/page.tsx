import { ChartAreaInteractive } from "./utils/chart-area-interactive"
import { DataTable } from "./utils/data-table"
import { SectionCards } from "./utils/section-cards"
import data from "./data.json"
import AdminLayout from "@components/layouts/admin-layout"

export default function Page() {
    return (
        <AdminLayout>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                        <DataTable data={data} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
