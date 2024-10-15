import { useState } from "react";

const usePagination = (totalItems, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return {
    currentPage,
    totalPages,
    handlePageChange,
  };
};

export { usePagination };
