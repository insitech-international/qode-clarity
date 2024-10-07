# from dataclasses import dataclass
# from typing import List

# @dataclass
# class Solution:
#     problem_classification: str
#     real_world_relevance: str
#     approach_selection: str
#     constraint_influence: str
#     code_design: str


# def get_solution(question_id: int) -> Solution:
#     return Solution(
#         # CLASSIFICATION REASON:
#         problem_classification="""
# The problem of counting smaller numbers after self is classified as an advanced data structure problem and specifically categorized under segment trees and bit manipulation due to several key reasons:

# 1. Complexity: It involves counting occurrences in large arrays, requiring advanced techniques for efficient solutions.
# 2. Space-efficiency: Optimal solutions aim to achieve logarithmic time complexity while using linear space.
# 3. Algorithmic approach: It requires clever algorithms that balance efficiency in both time and space usage.
# 4. Divide-and-conquer strategy: Solving this problem typically involves breaking down the problem into smaller sub-problems and solving them recursively.
# 5. Dynamic programming potential: Some approaches may involve building up partial solutions, similar to dynamic programming techniques.
# 6. Efficient data structures: The problem requires the use of specialized data structures beyond simple arrays, allowing for quick range queries and updates.
# 7. Bit manipulation: This technique allows for counting occurrences in constant time, which is crucial for optimal solutions.

# These factors justify its classification as an advanced problem in computer science, particularly related to segment trees and bit manipulation techniques.
# """,

# # LOGIC EXPLANATION:
# real_world_relevance=
# """
# Financial Analysis and Portfolio Management:
# In portfolio management, counting smaller values to the right of self could be used to identify clusters of low-performing stocks within a portfolio.
# For example, if we have a list of stock prices over time, we might want to count how many days had lower closing prices than today's price, to gauge overall market performance.
# Healthcare and Biomedical Research:
# In genomic analysis, this concept could be applied to studying gene expression levels along a chromosome.
# Researchers might count how many base pairs downstream of a particular gene have lower expression levels, to identify regulatory elements.
# Environmental Monitoring and Climate Science:
# In climate data analysis, this could be used to study temperature trends over time.
# Scientists might count how many consecutive years had lower average temperatures than the current year, to identify cooling trends.
# These examples illustrate how counting smaller values to the right of self can be applied to various real-world scenarios:

# Identifying patterns or trends in sequential data
# Analyzing temporal changes in measurements
# Spotting anomalies or significant deviations from recent norms
# The core idea remains the same: we're looking at how many subsequent items in a sequence meet a certain condition (being smaller than the current item). This approach can be valuable in domains dealing with time-series data, sequential analysis, or identifying patterns in evolving systems.
# """,

# # BEST APPROACH:
# approach_selection="""
# The best approach for the "Count of Smaller Numbers After Self" problem is to use a Binary Search Tree (BST) with a modified insertion method. Here's why this approach is effective:

# Time Complexity: The BST approach achieves a time complexity of O(n log n), which is significantly better than the naive O(n^2) approach of comparing each element to all others to its right 5.
# Space Efficiency: The BST approach uses linear space, which is optimal for this problem 5.
# Efficient Insertion: By modifying the standard BST insertion algorithm, we can keep track of the count of smaller elements to the right of each number as we insert it into the tree 5.
# Simplicity: Despite its efficiency, this approach is relatively simple to understand and implement compared to more complex solutions like Binary Indexed Trees 5.
# Scalability: The BST approach scales well for large inputs, making it suitable for real-world applications where dealing with large datasets is common 5.
# Flexibility: This approach can be easily adapted to handle variations of the problem, such as counting smaller elements to the left or within a specific range 5.
# The key insight behind this approach is that as we insert each number into the BST, we can efficiently count the smaller elements to its right by utilizing the properties of binary search trees. This allows us to build up the solution incrementally, avoiding the need for multiple passes through the array 5.

# In conclusion, the BST approach offers a good balance between efficiency, simplicity, and practicality for solving the "Count of Smaller Numbers After Self" problem.

# What is BST Approach?

# A Binary Search Tree (BST) is a special way of organizing data in a tree-like structure. In simple terms, a BST is like a filing cabinet where each drawer can have at most two sub-drawers, organized from smallest to largest. This structure makes finding information quick and efficient!
# Core Concepts of BST Data Structure:

# 1. Traditional BST:

# The left child contains values less than the parent node.
# The right child contains values greater than the parent node.
# These definitions imply that left and right children cannot be equal.

# 2. Structure:
# Each piece of data (node) can have up to two children.
# The left child has smaller values, and the right child has bigger values.

# 3. Functionality:
# Quickly find values by starting at the root and moving left or right.
# Easily add new data and remove old data while maintaining the structure.

# 4. Performance:
# Ideal BST: Operations happen quickly (log time).
# Worst case: If added in order, it becomes inefficient (linear time).

# 5. Uses:
# Organize large datasets
# Create indexes in databases
# Manage collections of items

# 6. Self-adjusting variants:
# Some trees automatically rebalance to maintain efficiency.
# """,

# # CONSTRAINTS:
#        constraint_influence="""
#        Constraint Influence on Binary Search Tree Approach
# 1. Duplicate Handling:

# Problem: Allowing duplicates in a BST violates the fundamental property of having unique values in each node.
# Example: {5, 3, 3, 7, 9}
# This violates the normal BST rule (each node should have unique values).
# Solution: Store duplicates in a list at the node.
# 2. Traversal Order:

# Problem: Different traversal orders yield different sequences and interpretations of the tree structure.
# Example:
# Pre-order: 5, 3, 7, 2, 4, 8
# In-order: 2, 3, 4, 5, 7, 8
# Post-order: 2, 4, 3, 8, 7, 5
# Solution: Implement traversal methods to obtain the desired order for specific operations (e.g., sorting, evaluating).
# 3. Height Limitations:

# Problem: The height of the tree can significantly affect the efficiency of operations (search, insert, delete).
# Example:
# Ideal BST: {1, 2, 3, 4, 5} (height = log(n))
# Worst Case: {1, 2, 4, 8, 16, ...} (height = n)
# Solution: Balance the tree (e.g., using AVL or Red-Black Trees) to ensure height remains logarithmic.
# 4. Edge Case Handling:

# Problem: Different configurations of the tree can lead to various edge cases that need special handling.
# Example:
# Empty Tree: {}
# Single-node Tree: {5}
# Imbalanced Tree: {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
# Solution: Implement checks for tree state and structure to handle these cases appropriately.
# """,

# # CODE DESIGN:
# code_design="""

# from typing import List

# # This code implements a Binary Search Tree (BST) that counts the number of smaller elements
# # to the right of each element in a given list using a reverse traversal method.

# class TreeNode:
#     def __init__(self, val: int):
#         self.val = val
#         self.left = None
#         self.right = None
#         self.count = 0

# class BST:
#     def __init__(self):
#         self.root = None

#     def insert(self, val: int) -> int:
#         if not self.root:
#             self.root = TreeNode(val)
#             return 0
#         return self._insert(self.root, val)

#     def _insert(self, node: TreeNode, val: int) -> int:
#         if val < node.val:
#             node.count += 1
#             if node.left:
#                 return self._insert(node.left, val)
#             else:
#                 node.left = TreeNode(val)
#                 return node.count
#         else:
#             if node.right:
#                 return self._insert(node.right, val)
#             else:
#                 node.right = TreeNode(val)
#                 return node.count

# def count_smaller(nums: List[int]) -> List[int]:
#     bst = BST()
#     result = []
#     for num in reversed(nums):
#         count = bst.insert(num)
#         result.append(count)
#     return result[::-1]

# # Example usage
# if __name__ == "__main__":
#     nums = [5, 2, 6, 1]
#     print(count_smaller(nums))  # Output: [2, 1, 1, 0]
# """,
#     )