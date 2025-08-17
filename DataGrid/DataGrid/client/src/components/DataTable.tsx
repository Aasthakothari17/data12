import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Employee } from '@shared/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronUp, ChevronDown, Search, Plus, Edit, Trash2, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type SortDirection = 'asc' | 'desc' | null;
type SortColumn = keyof Employee;
type SelectionMode = 'single' | 'multiple' | 'none';

interface DataTableProps {
  className?: string;
}

export function DataTable({ className }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('salary');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('multiple');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch employees data
  const { data: employees = [], isLoading, error } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({
        title: "Employee deleted",
        description: "Employee has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete employee.",
        variant: "destructive",
      });
    },
  });

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return sortDirection === 'asc' ? comparison : -comparison;
        }

        return 0;
      });
    }

    return filtered;
  }, [employees, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / pageSize);
  const paginatedEmployees = filteredAndSortedEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') {
        setSortColumn(column);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowSelection = (employeeId: string, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (selectionMode === 'single') {
      newSelectedRows.clear();
      if (checked) {
        newSelectedRows.add(employeeId);
      }
    } else if (selectionMode === 'multiple') {
      if (checked) {
        newSelectedRows.add(employeeId);
      } else {
        newSelectedRows.delete(employeeId);
      }
    }
    
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (checked: boolean) => {
    if (selectionMode === 'multiple') {
      const newSelectedRows = new Set<string>();
      if (checked) {
        paginatedEmployees.forEach(employee => newSelectedRows.add(employee.id));
      }
      setSelectedRows(newSelectedRows);
    }
  };

  const handleDelete = (id: string) => {
    deleteEmployeeMutation.mutate(id);
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      'on-leave': 'secondary',
      inactive: 'destructive',
    };

    const labels: Record<string, string> = {
      active: 'Active',
      'on-leave': 'On Leave',
      inactive: 'Inactive',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className={cn(
        status === 'active' && 'bg-green-100 text-green-800 hover:bg-green-100',
        status === 'on-leave' && 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
        status === 'inactive' && 'bg-red-100 text-red-800 hover:bg-red-100'
      )}>
        {labels[status] || status}
      </Badge>
    );
  };

  const SortIcon = ({ column }: { column: SortColumn }) => (
    <div className="flex flex-col ml-2">
      <ChevronUp 
        className={cn(
          "h-3 w-3 text-gray-400",
          sortColumn === column && sortDirection === 'asc' && "text-primary-500"
        )} 
      />
      <ChevronDown 
        className={cn(
          "h-3 w-3 text-gray-400 -mt-1",
          sortColumn === column && sortDirection === 'desc' && "text-primary-500"
        )} 
      />
    </div>
  );

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <Inbox className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading data</h3>
            <p className="text-gray-500">Failed to load employee data. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {/* Header with Actions */}
      <CardHeader className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900" data-testid="table-title">Employee Data</h2>
            {selectedRows.size > 0 && (
              <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium" data-testid="selection-count">
                {selectedRows.size} selected
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Selection Mode Control */}
            <Select value={selectionMode} onValueChange={(value: SelectionMode) => setSelectionMode(value)}>
              <SelectTrigger className="w-32" data-testid="select-selection-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple">Multiple</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Search Input */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            <Button className="bg-primary-500 hover:bg-primary-600" data-testid="button-add-employee">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          /* Loading State */
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-12 px-6 py-3">
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="px-6 py-3"><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead className="px-6 py-3"><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead className="px-6 py-3"><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead className="px-6 py-3"><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead className="px-6 py-3"><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead className="px-6 py-3"><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead className="px-6 py-3"><Skeleton className="h-4 w-16" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="ml-4 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-12" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : filteredAndSortedEmployees.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12" data-testid="empty-state">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <Inbox className="h-24 w-24" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {searchTerm ? 'No employees match your search criteria.' : 'Get started by adding your first employee to the system.'}
            </p>
            <Button className="bg-primary-500 hover:bg-primary-600" data-testid="button-add-first-employee">
              <Plus className="h-4 w-4 mr-2" />
              Add First Employee
            </Button>
          </div>
        ) : (
          /* Data State */
          <div className="overflow-x-auto" data-testid="data-table">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  {selectionMode !== 'none' && (
                    <TableHead className="w-12 px-6 py-3">
                      {selectionMode === 'multiple' && (
                        <Checkbox
                          checked={paginatedEmployees.length > 0 && paginatedEmployees.every(emp => selectedRows.has(emp.id))}
                          onCheckedChange={(checked) => handleSelectAll(checked === true)}
                          aria-label="Select all rows"
                          data-testid="checkbox-select-all"
                        />
                      )}
                    </TableHead>
                  )}
                  <TableHead 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 user-select-none"
                    onClick={() => handleSort('name')}
                    data-testid="header-name"
                  >
                    <div className="flex items-center justify-between">
                      <span>Name</span>
                      <SortIcon column="name" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 user-select-none"
                    onClick={() => handleSort('email')}
                    data-testid="header-email"
                  >
                    <div className="flex items-center justify-between">
                      <span>Email</span>
                      <SortIcon column="email" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 user-select-none"
                    onClick={() => handleSort('department')}
                    data-testid="header-department"
                  >
                    <div className="flex items-center justify-between">
                      <span>Department</span>
                      <SortIcon column="department" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 user-select-none"
                    onClick={() => handleSort('role')}
                    data-testid="header-role"
                  >
                    <div className="flex items-center justify-between">
                      <span>Role</span>
                      <SortIcon column="role" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 user-select-none"
                    onClick={() => handleSort('salary')}
                    data-testid="header-salary"
                  >
                    <div className="flex items-center justify-between">
                      <span>Salary</span>
                      <SortIcon column="salary" />
                    </div>
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.map((employee) => (
                  <TableRow 
                    key={employee.id} 
                    className={cn(
                      "hover:bg-gray-50 transition-colors duration-200",
                      selectedRows.has(employee.id) && "bg-primary-50 border-primary-200"
                    )}
                    data-testid={`row-employee-${employee.id}`}
                  >
                    {selectionMode !== 'none' && (
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Checkbox
                          checked={selectedRows.has(employee.id)}
                          onCheckedChange={(checked) => handleRowSelection(employee.id, checked === true)}
                          aria-label="Select this row"
                          data-testid={`checkbox-select-${employee.id}`}
                        />
                      </TableCell>
                    )}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=1976D2&color=fff`}
                            alt="Profile picture"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900" data-testid={`text-name-${employee.id}`}>
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" data-testid={`text-email-${employee.id}`}>
                        {employee.email}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" data-testid={`text-department-${employee.id}`}>
                        {employee.department}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" data-testid={`text-role-${employee.id}`}>
                        {employee.role}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900" data-testid={`text-salary-${employee.id}`}>
                        ${employee.salary.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(employee.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-900 transition-colors duration-200 p-1"
                          data-testid={`button-edit-${employee.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1"
                          onClick={() => handleDelete(employee.id)}
                          disabled={deleteEmployeeMutation.isPending}
                          data-testid={`button-delete-${employee.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Table Footer with Pagination */}
        {!isLoading && filteredAndSortedEmployees.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>Showing</span>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                <SelectTrigger className="mx-2 w-20" data-testid="select-page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>of {filteredAndSortedEmployees.length} results</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                data-testid="button-previous-page"
              >
                <ChevronUp className="h-4 w-4 mr-1 rotate-90" />
                Previous
              </Button>
              <div className="flex space-x-1">
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;
                  return (
                    <Button
                      key={page}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        isActive && "bg-primary-500 border-primary-500 hover:bg-primary-600"
                      )}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-3 py-2 text-sm text-gray-500">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      data-testid="button-last-page"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                Next
                <ChevronDown className="h-4 w-4 ml-1 rotate-90" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
