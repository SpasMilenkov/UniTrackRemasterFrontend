export function useCalculateSeverity(mark: number) {
        switch (mark) {
            case 2:
                return 'danger'
            case 3:
                return 'warning'
            case 4:
                return 'normal'
            case 5:
                return 'info'
            case 6:
                return 'success'
        }
}