interface PaginationButton {
    label: string;
    url: string;
    active: boolean;
}

interface Pagination {
    totalPages: number;
    currentPage: number;
}

export const renderPagination = (pagination: Pagination, params: string = '&limit=10&sort=asc'): PaginationButton[] => {
    const buttons: PaginationButton[] = [];
    const range = 2; // number of buttons to show before and after the current page

    if (pagination.totalPages <= range * 2 + 1) {
        // if total pages is less than or equal to 7, show all buttons
        for (let i = 1; i <= pagination.totalPages; i++) {
            buttons.push({
                label: `${i}`,
                url: `?page=${i}${params}`,
                active: i === pagination.currentPage,
            });
        }
    } else {
        // if total pages is greater than 7, show only a subset of buttons
        const start = Math.max(1, pagination.currentPage - range);
        const end = Math.min(pagination.totalPages, pagination.currentPage + range);

        if (start > 2) {
            buttons.push({
                label: `1`,
                url: `?page=1${params}`,
                active: false,
            });
            if (start > 3) {
                buttons.push({
                    label: `...`,
                    url: `#`,
                    active: false,
                });
            }
        }

        for (let i = start; i <= end; i++) {
            buttons.push({
                label: `${i}`,
                url: `?page=${i}${params}`,
                active: i === pagination.currentPage,
            });
        }

        if (end < pagination.totalPages - 1) {
            if (end < pagination.totalPages - 2) {
                buttons.push({
                    label: `...`,
                    url: `#`,
                    active: false,
                });
            }
            buttons.push({
                label: `${pagination.totalPages}`,
                url: `?page=${pagination.totalPages}${params}`,
                active: false,
            });
        }
    }
    return buttons;
}