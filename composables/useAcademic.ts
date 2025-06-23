// composables/useAcademic.ts
import { useAcademicStore } from '~/stores/academic';

export function useAcademic() {
  const store = useAcademicStore();

  // Department type options
  const departmentTypeOptions = [
    { label: 'Academic', value: 0 },
    { label: 'Administrative', value: 1 },
    { label: 'Research', value: 2 },
    { label: 'Service', value: 3 },
  ];

  // Department status options
  const departmentStatusOptions = [
    { label: 'Active', value: 0 },
    { label: 'Inactive', value: 1 },
    { label: 'Planning', value: 2 },
    { label: 'Discontinued', value: 3 },
  ];

  // Faculty status options
  const facultyStatusOptions = [
    { label: 'Active', value: 0 },
    { label: 'Inactive', value: 1 },
    { label: 'Planning', value: 2 },
  ];

  // Initialize all academic data
  async function initializeAcademicData() {
    await store.initializeStore();
  }

  // Get type/status label by value
  function getDepartmentTypeLabel(value: number): string {
    const type = departmentTypeOptions.find((t) => t.value === value);
    return type ? type.label : 'Unknown';
  }

  function getDepartmentStatusLabel(value: number): string {
    const status = departmentStatusOptions.find((s) => s.value === value);
    return status ? status.label : 'Unknown';
  }

  function getFacultyStatusLabel(value: number): string {
    const status = facultyStatusOptions.find((s) => s.value === value);
    return status ? status.label : 'Unknown';
  }

  // Create standard pagination
  //   function createPagination(
  //     onChange?: (page: number) => void,
  //     onUpdatePageSize?: (pageSize: number) => void
  //   ) {
  //     return reactive({
  //       page: 1,
  //       pageSize: 10,
  //       showSizePicker: true,
  //       pageSizes: [10, 20, 50],
  //       onChange:
  //         onChange ||
  //         ((page: number) => {
  //           pagination.page = page;
  //         }),
  //       onUpdatePageSize:
  //         onUpdatePageSize ||
  //         ((pageSize: number) => {
  //           pagination.pageSize = pageSize;
  //           pagination.page = 1;
  //         }),
  //     });
  //   }

  // Create status badge render function
  function createStatusBadgeRender(options: any[], valueField = 'status') {
    return (row: any) => {
      const value = row[valueField];
      const statusOption = options.find((s) => s.value === value);

      return h(
        'div',
        {
          class: `px-2 py-1 rounded-full text-center text-xs font-medium ${
            value === 0
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
              : value === 1
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                : value === 2
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
          }`,
        },
        statusOption ? (statusOption.label as string) : 'Unknown'
      );
    };
  }

  return {
    // Options
    departmentTypeOptions,
    departmentStatusOptions,
    facultyStatusOptions,

    // Helpers
    initializeAcademicData,
    getDepartmentTypeLabel,
    getDepartmentStatusLabel,
    getFacultyStatusLabel,
    createStatusBadgeRender,
  };
}
