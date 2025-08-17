import { DataTable } from '@/components/DataTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8" data-testid="page-header">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DataTable Component</h1>
          <p className="text-lg text-gray-600">Interactive table with sorting, selection, and state management</p>
        </div>

        {/* DataTable Component */}
        <DataTable className="mb-8" />

        {/* Table Features Documentation */}
        <div className="bg-white rounded-lg shadow-material border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                <i className="fas fa-sort text-primary-500 mr-2"></i>Column Sorting
              </h4>
              <p className="text-sm text-gray-600">Click column headers to sort data ascending or descending with visual indicators.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                <i className="fas fa-check-square text-primary-500 mr-2"></i>Row Selection
              </h4>
              <p className="text-sm text-gray-600">Support for single and multiple row selection with select all functionality.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                <i className="fas fa-spinner text-primary-500 mr-2"></i>Loading States
              </h4>
              <p className="text-sm text-gray-600">Skeleton UI provides smooth loading experience while fetching data.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                <i className="fas fa-inbox text-primary-500 mr-2"></i>Empty States
              </h4>
              <p className="text-sm text-gray-600">Friendly empty state with clear call-to-action when no data is available.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                <i className="fas fa-mobile-alt text-primary-500 mr-2"></i>Responsive Design
              </h4>
              <p className="text-sm text-gray-600">Horizontal scrolling on mobile devices ensures all data remains accessible.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                <i className="fas fa-universal-access text-primary-500 mr-2"></i>Accessibility
              </h4>
              <p className="text-sm text-gray-600">ARIA labels, keyboard navigation, and screen reader support built-in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
