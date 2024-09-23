export class EmployeeFilter {
  name: string = '';
  position: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  sortColumn: string = 'name';
  ascending: boolean = true;
}