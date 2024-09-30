import React, { useState } from "react";

const categories = [
  {
    id: "advanced_data_structures",
    name: "Advanced Data Structures",
    subcategories: [
      { id: "segment_tree_and_bit", name: "Segment Tree and BIT" },
      { id: "trie", name: "Trie" },
      { id: "union_find", name: "Union Find" },
    ],
  },
  {
    id: "array_and_string_manipulation",
    name: "Array and String Manipulation",
    subcategories: [
      { id: "interval_operations", name: "Interval Operations" },
      {
        id: "prefix_sum_and_range_queries",
        name: "Prefix Sum and Range Queries",
      },
      { id: "sliding_window", name: "Sliding Window" },
      { id: "two_pointer_techniques", name: "Two Pointer Techniques" },
    ],
  },
  {
    id: "backtracking_and_recursion",
    name: "Backtracking and Recursion",
    subcategories: [
      { id: "combination_problems", name: "Combination Problems" },
      { id: "grid_backtracking", name: "Grid Backtracking" },
      { id: "string_backtracking", name: "String Backtracking" },
    ],
  },
  {
    id: "bit_manipulation",
    name: "Bit Manipulation",
    subcategories: [
      { id: "advanced_bit_manipulation", name: "Advanced Bit Manipulation" },
      { id: "basic_bit_operations", name: "Basic Bit Operations" },
    ],
  },
  {
    id: "concurrency_and_parallel_programming",
    name: "Concurrency and Parallel Programming",
    subcategories: [
      { id: "producer_consumer_problems", name: "Producer Consumer Problems" },
      { id: "reader_writer_problems", name: "Reader Writer Problems" },
      { id: "thread_synchronization", name: "Thread Synchronization" },
    ],
  },
  {
    id: "dynamic_programming",
    name: "Dynamic Programming",
    subcategories: [
      { id: "1d_dp", name: "1D DP" },
      { id: "2d_dp", name: "2D DP" },
      { id: "knapsack_problems", name: "Knapsack Problems" },
      { id: "state_machine_dp", name: "State Machine DP" },
    ],
  },
  {
    id: "greedy_algorithms",
    name: "Greedy Algorithms",
    subcategories: [
      { id: "activity_selection", name: "Activity Selection" },
      { id: "greedy_string_manipulation", name: "Greedy String Manipulation" },
      { id: "interval_scheduling", name: "Interval Scheduling" },
    ],
  },
  {
    id: "heap_and_priority_queue",
    name: "Heap and Priority Queue",
    subcategories: [
      { id: "merge_k_sorted_structures", name: "Merge K Sorted Structures" },
      { id: "sliding_window_with_heap", name: "Sliding Window With Heap" },
      { id: "top_k_problems", name: "Top K Problems" },
    ],
  },
  {
    id: "linked_list_techniques",
    name: "Linked List Techniques",
    subcategories: [
      {
        id: "advanced_linked_list_operations",
        name: "Advanced Linked List Operations",
      },
      { id: "fast_and_slow_pointers", name: "Fast and Slow Pointers" },
      { id: "traversal_and_modification", name: "Traversal and Modification" },
    ],
  },
  {
    id: "math_and_number_theory",
    name: "Math and Number Theory",
    subcategories: [
      { id: "mathematical_algorithms", name: "Mathematical Algorithms" },
      { id: "matrix_operations", name: "Matrix Operations" },
      {
        id: "prime_numbers_and_factorization",
        name: "Prime Numbers and Factorization",
      },
    ],
  },
  {
    id: "python_specific_concepts",
    name: "Python Specific Concepts",
    subcategories: [
      { id: "advanced_python_concepts", name: "Advanced Python Concepts" },
      { id: "python_best_practices", name: "Python Best Practices" },
      { id: "python_data_structures", name: "Python Data Structures" },
      { id: "python_language_features", name: "Python Language Features" },
      { id: "python_standard_library", name: "Python Standard Library" },
    ],
  },
  {
    id: "searching_and_sorting",
    name: "Searching and Sorting",
    subcategories: [
      { id: "binary_search_and_variants", name: "Binary Search and Variants" },
      { id: "custom_sorting", name: "Custom Sorting" },
      { id: "sorting_algorithms", name: "Sorting Algorithms" },
    ],
  },
  {
    id: "string_algorithms",
    name: "String Algorithms",
    subcategories: [
      { id: "string_manipulation", name: "String Manipulation" },
      { id: "string_matching", name: "String Matching" },
    ],
  },
  {
    id: "system_design_and_oop",
    name: "System Design and OOP",
    subcategories: [
      { id: "algorithm_implementation", name: "Algorithm Implementation" },
      { id: "data_structure_design", name: "Data Structure Design" },
    ],
  },
  {
    id: "tree_and_graph_algorithms",
    name: "Tree and Graph Algorithms",
    subcategories: [
      { id: "advanced_graph_algorithms", name: "Advanced Graph Algorithms" },
      {
        id: "binary_search_tree_operations",
        name: "Binary Search Tree Operations",
      },
      { id: "graph_traversal", name: "Graph Traversal" },
      { id: "tree_traversal", name: "Tree Traversal" },
    ],
  },
];

const CategoryDropdown = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    setSelectedCategory(category);
  };

  return (
    <div className="category-dropdown">
      <label htmlFor="#">Select Category:</label>
      <select id="category" onChange={handleCategoryChange}>
        <option value="">--Select a Category--</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <div className="subcategory-dropdown">
          <label htmlFor="#">Select Subcategory:</label>
          <select id="subcategory">
            <option value="">--Select a Subcategory--</option>
            {selectedCategory.subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
