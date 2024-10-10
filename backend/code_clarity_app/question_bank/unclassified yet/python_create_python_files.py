import os

# The structure with titles as keys and lists of problems as values
structure = {
    "Array_and_String_Manipulation": {
        "Two_Pointer_Techniques": [
            "Two Sum",
            "Container With Most Water",
            "3Sum",
            "Remove Duplicates from Sorted Array",
            "Trapping Rain Water",
            "Move Zeroes"
        ],
        "Sliding_Window": [
            "Longest Substring Without Repeating Characters",
            "Minimum Window Substring",
            "Find All Anagrams in a String",
            "Sliding Window Maximum"
        ],
        "Prefix_Sum_and_Range_Queries": [
            "Range Sum Query - Immutable",
            "Range Sum Query 2D - Immutable",
            "Continuous Subarray Sum"
        ],
        "Interval_Operations": [
            "Merge Intervals",
            "Insert Interval",
            "Non-overlapping Intervals",
            "Meeting Rooms II"
        ]
    },
    "Linked_List_Techniques": {
        "Traversal_and_Modification": [
            "Reverse Linked List",
            "Merge Two Sorted Lists",
            "Remove Nth Node From End of List",
            "Odd Even Linked List"
        ],
        "Fast_and_Slow_Pointers": [
            "Linked List Cycle",
            "Find the Duplicate Number",
            "Middle of the Linked List",
            "Palindrome Linked List"
        ],
        "Advanced_Linked_List_Operations": [
            "LRU Cache",
            "Flatten a Multilevel Doubly Linked List",
            "Copy List with Random Pointer"
        ]
    },
    "Tree_and_Graph_Algorithms": {
        "Tree_Traversal": [
            "Binary Tree Inorder Traversal",
            "Binary Tree Level Order Traversal",
            "Binary Tree Zigzag Level Order Traversal",
            "Serialize and Deserialize Binary Tree"
        ],
        "Binary_Search_Tree_Operations": [
            "Validate Binary Search Tree",
            "Kth Smallest Element in a BST",
            "Lowest Common Ancestor of a Binary Search Tree"
        ],
        "Graph_Traversal": [
            "Number of Islands",
            "Course Schedule",
            "Word Ladder",
            "Clone Graph"
        ],
        "Advanced_Graph_Algorithms": [
            "Dijkstra's Algorithm",
            "Bellman-Ford Algorithm",
            "Floyd-Warshall Algorithm",
            "Network Delay Time",
            "Cheapest Flights Within K Stops"
        ]
    },
    "Dynamic_Programming": {
        "1D_DP": [
            "Climbing Stairs",
            "House Robber",
            "Longest Increasing Subsequence"
        ],
        "2D_DP": [
            "Unique Paths",
            "Longest Common Subsequence",
            "Edit Distance"
        ],
        "Knapsack_Problems": [
            "Zero One Knapsack",
            "Coin Change",
            "Partition Equal Subset Sum"
        ],
        "State_Machine_DP": [
            "Best Time To Buy Sell Stock",
            "Best Time To Buy Sell Stock II",
            "Best Time To Buy Sell Stock Cooldown"
        ]
    },
    "Searching_and_Sorting": {
        "Binary_Search_and_Variants": [
            "Binary Search",
            "Search In Rotated Sorted Array",
            "Find Min In Rotated Sorted Array",
            "Search 2D Matrix"
        ],
        "Sorting_Algorithms": [
            "Quick Sort",
            "Merge Sort",
            "Heap Sort",
            "Counting Sort"
        ],
        "Custom_Sorting": [
            "Sort Colors",
            "Sort Characters By Frequency",
            "Custom Sort String"
        ]
    },
    "Heap_and_Priority_Queue": {
        "Top_K_Problems": [
            "Kth Largest Element Array",
            "Top K Frequent Elements",
            "Find K Pairs With Smallest Sums"
        ],
        "Merge_K_Sorted_Structures": [
            "Merge K Sorted Lists",
            "Smallest Range Covering Elements From K Lists"
        ],
        "Sliding_Window_With_Heap": [
            "Sliding Window Median",
            "Find Median From Data Stream"
        ]
    },
    "Backtracking_and_Recursion": {
        "Combination_Problems": [
            "Subsets",
            "Combination Sum",
            "Permutations"
        ],
        "String_Backtracking": [
            "Generate Parentheses",
            "Palindrome Partitioning",
            "Word Search"
        ],
        "Grid_Backtracking": [
            "N Queens",
            "Sudoku Solver"
        ]
    },
    "Greedy_Algorithms": {
        "Interval_Scheduling": [
            "Non Overlapping Intervals",
            "Min Arrows To Burst Balloons"
        ],
        "Activity_Selection": [
            "Jump Game",
            "Gas Station"
        ],
        "Greedy_String_Manipulation": [
            "Partition Labels",
            "Remove K Digits"
        ]
    },
    "Bit_Manipulation": {
        "Basic_Bit_Operations": [
            "Single Number",
            "Number Of 1 Bits",
            "Counting Bits"
        ],
        "Advanced_Bit_Manipulation": [
            "Reverse Bits",
            "Bitwise AND Of Numbers Range",
            "Maximum XOR Of Two Numbers"
        ]
    },
    "Advanced_Data_Structures": {
        "Trie": [
            "Implement Trie",
            "Word Search II",
            "Design Add Search Words Data Structure"
        ],
        "Union_Find": [
            "Number Of Islands II",
            "Accounts Merge",
            "Redundant Connection"
        ],
        "Segment_Tree_and_BIT": [
            "Range Sum Query Mutable",
            "Count Smaller Numbers After Self"
        ]
    },
    "String_Algorithms": {
        "String_Matching": [
            "Implement strStr",
            "Longest Palindromic Substring",
            "Regular Expression Matching"
        ],
        "String_Manipulation": [
            "Group Anagrams",
            "Longest Substring K Distinct Characters",
            "Minimum Window Substring"
        ]
    },
    "Math_and_Number_Theory": {
        "Prime_Numbers_and_Factorization": [
            "Count Primes",
            "Ugly Number II"
        ],
        "Matrix_Operations": [
            "Rotate Image",
            "Spiral Matrix"
        ],
        "Mathematical_Algorithms": [
            "Pow",
            "Sqrt",
            "Max Points On A Line"
        ]
    },
    "System_Design_and_OOP": {
        "Data_Structure_Design": [
            "LRU Cache",
            "Design Twitter",
            "Design File System"
        ],
        "Algorithm_Implementation": [
            "Implement Queue Using Stacks",
            "Min Stack",
            "Serialize Deserialize Binary Tree"
        ]
    },
    "Concurrency_and_Parallel_Programming": {
        "Thread_Synchronization": [
            "Print In Order",
            "Print FooBar Alternately"
        ],
        "Producer_Consumer_Problems": [
            "Design Bounded Blocking Queue"
        ],
        "Reader_Writer_Problems": [
            "Web Crawler Multithreaded"
        ]
    },
    "Python_Specific_Concepts": {
        "Python_Data_Structures": [
            "List Comprehensions",
            "Dictionaries Sets",
            "Collections Module"
        ],
        "Python_Language_Features": [
            "Decorators Context Managers",
            "Lambda Map Filter Reduce",
            "Iterators Generators"
        ],
        "Python_Standard_Library": [
            "Itertools Functools",
            "JSON Handling",
            "Regular Expressions"
        ],
        "Python_Best_Practices": [
            "PEP8 Style Guide",
            "Error Handling Logging",
            "Unit Testing"
        ],
        "Advanced_Python_Concepts": [
            "Metaclasses Descriptors",
            "Coroutines Asyncio",
            "Multithreading Multiprocessing"
        ]
    }
}

# Function to convert problem name to a valid filename
def convert_to_filename(problem_name):
    # Convert problem name to lower case and replace spaces with underscores
    return problem_name.replace(" ", "_").replace("-", "_") + ".json"

# Base directory where the structure will be created
base_dir = os.getcwd()  # Current working directory or specify a path

# Function to create the directory structure and files
def create_structure(base_dir, structure):
    for category, subcategories in structure.items():
        category_dir = os.path.join(base_dir, category)
        os.makedirs(category_dir, exist_ok=True)  # Create category directory
        
        for subcategory, problems in subcategories.items():
            subcategory_dir = os.path.join(category_dir, subcategory)
            os.makedirs(subcategory_dir, exist_ok=True)  # Create subcategory directory
            
            for problem in problems:
                problem_filename = convert_to_filename(problem)
                problem_path = os.path.join(subcategory_dir, problem_filename)
                
                # Create the file for each problem
                with open(problem_path, 'w') as f:
                    f.write(f"# Solution for {problem}\n\n")
                print(f"Created file: {problem_path}")

# Create the structure
create_structure(base_dir, structure)
