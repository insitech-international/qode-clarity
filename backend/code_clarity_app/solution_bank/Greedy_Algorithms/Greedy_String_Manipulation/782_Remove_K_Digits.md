# Title

Remove K Digits for Inventory Management

# Difficulty

Medium

# Category

Greedy Algorithms

# Subcategory

String Manipulation

# Similar Questions

{"LeetCode": "402", "PlatformB": 1}

# Real Life Domains

Inventory Management, Data Compression, Resource Allocation, Financial Analysis

# Version 1

LeetCode Version
Given string num representing a non-negative integer num, and an integer k, return the smallest possible integer after removing k digits from num.

Example 1:
Input: num = "1432219", k = 3
Output: "1219"
Explanation: Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.

Example 2:
Input: num = "10200", k = 1
Output: "200"
Explanation: Remove the leading 1 and the number is 200. Note that the output must not contain leading zeroes.

Example 3:
Input: num = "10", k = 2
Output: "0"
Explanation: Remove all the digits from the number and it is left with nothing which is 0.

# Version 2

Inventory Management Scenario:
You are managing an inventory system where each item is represented by a unique identification number as a string of digits. Due to a recent inventory audit, you need to streamline these ID numbers by removing a specified number of digits. The goal is to ensure the smallest possible ID number remains after removing these digits while preserving the order of the remaining digits.

Financial Analysis Scenario:
In a financial analysis tool, you're working with large numbers representing monetary values. To simplify reports, you need to reduce these numbers by removing a certain number of digits while keeping the value as small as possible. Develop an algorithm to achieve this digit removal optimization.

Data Compression Scenario:
You're developing a lossy compression algorithm for numeric data. The algorithm needs to remove a specified number of digits from each number to reduce data size while minimizing the change in value. Create a function that removes K digits from a number to produce the smallest possible result.

For all scenarios, create an algorithm that removes K digits from the given string to produce the smallest possible number. If K is equal to or larger than the length of the string, return '0'.

Example 1:
Input: {"num": "1432219", "k": 3}
Output: "1219"
Explanation: Removing the digits '4', '3', and '2' results in the smallest number '1219'.

Example 2:
Input: {"num": "10200", "k": 1}
Output: "200"
Explanation: Removing the digit '1' gives '0200', but '200' is the smallest possible representation.

# Constraints

The input string will only contain digits (0-9).
K will be a non-negative integer less than or equal to the length of the string.
