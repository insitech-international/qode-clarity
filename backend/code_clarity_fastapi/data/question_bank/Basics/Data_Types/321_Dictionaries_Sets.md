**Dictionaries and Sets: Fundamental Data Structures in Programming**

# Metadata

- **ID**: 321
- **Title**: Dictionaries and Sets: Fundamental Data Structures in Programming
- **Difficulty**: Easy
- **Category**: Algorithms and Data Structures
- **Subcategory**: Data Types
- **Similar Questions**: LeetCode: 49, HackerRank: Dictionary Comprehension
- **Real Life Domains**: Configuration Files, Caching, Data Storage, Set Operations

# Problem Description

Dictionaries and sets are fundamental data structures in many programming languages. Dictionaries (also known as hash tables or associative arrays) store key-value pairs, while sets store unique elements without duplicates. Understanding these structures is crucial for efficient data organization and manipulation.

# Versions

## Version 1: LeetCode - Group Anagrams

Given an array of strings, group anagrams together.

Example:
- Input: ["eat","tea","tan","ate","nat","bat"]
- Output: [["bat"],["nat","tan"],["ate","tea","eat"]]

## Version 2: HackerRank - Dictionary Comprehension

Given a dictionary `d` with keys of type string and values of type integer, create a new dictionary `result` with the same keys but double the corresponding values.

Example:
- Input: d = {"a": 1, "b": 2, "c": 3}
- Output: {"a": 2, "b": 4, "c": 6}

## Version 3: Real-Life Scenario - Inventory Management System

Develop a system to manage inventory items. Use dictionaries to store item names as keys and their quantities as values. Implement methods to add items, remove items, and check stock levels.

Example:
- Input: inventory = {"apples": 50, "bananas": 75, "oranges": 100}
- Output: Remaining quantity of apples after selling 20

# Constraints

- For Version 1:
  - 1 <= s.length <= 10 ^ 4
  - s[i] consists only of lowercase English letters

- For Version 2:
  - Keys in d are unique
  - Values in d are non-negative integers

- For Version 3:
  - Item names are unique
  - Quantities are non-negative integers
  - Avoid negative quantities

# Notes

- Dictionaries in Python are implemented as hash tables, allowing for fast lookup and insertion.
- Sets in Python are unordered collections of unique elements.
- Use dictionary comprehension for concise creation of new dictionaries.
- Remember that dictionary keys must be immutable (strings, numbers, tuples).
- Sets are useful for removing duplicates from lists or performing set operations.
