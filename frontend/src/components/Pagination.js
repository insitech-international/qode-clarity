import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav className="flex items-center justify-between pt-4 pb-4 border-t border-gray-200">
      <div className="flex space-x-4">
        {prevPage && (
          <a
            href="#"
            onClick={() => onPageChange(prevPage)}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Previous
          </a>
        )}
      </div>
      <div className="flex space-x-4">
        {nextPage && (
          <a
            href="#"
            onClick={() => onPageChange(nextPage)}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </a>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
