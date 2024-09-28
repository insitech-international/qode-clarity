# 1. Why is it classified as String Algorithm/String Manipulation?
# This problem is classified as a String Algorithm/String Manipulation because:

# Anagram Definition: Anagrams are fundamentally related to strings, as they involve rearranging characters within strings to form new strings.
# Character Comparison: The primary operation in solving this problem involves comparing the characters of the strings and determining which strings can be grouped together based on their character composition.
# Transformations: The solution often requires transforming strings into a format that can be easily compared (e.g., sorting the characters or counting their occurrences), which is a common task in string manipulation.
# 2. Logic Interpretation in Plain English
# The problem asks you to take a list of product names (strings) and group them together based on whether they are anagrams of one another. Two strings are anagrams if they contain the same characters in the same frequency but can be arranged in different orders.

# For example:

# "bat" and "tab" are anagrams because they contain the same letters.
# "eat," "tea," and "ate" are also anagrams.
# The goal is to return a list of lists, where each inner list contains strings that are anagrams of each other.

# 3. Simplified Pseudocode
# Here’s a simplified version of the pseudocode to solve the problem:

# sql
# Copy code
# function group_anagrams(strs):
#     create an empty dictionary to hold grouped anagrams

#     for each string in strs:
#         sort the string or create a character count as key
#         if key exists in dictionary:
#             append the string to the corresponding list
#         else:
#             create a new list for this key and add the string

#     return the values of the dictionary as the final result
# 4. Best Approach and Why
# Best Approach: Use Sorting or Character Counting

# Sorting: For each string, sort its characters to create a standardized key. All anagrams will produce the same key when sorted.
# Why: This method is straightforward and easy to understand. It allows you to group anagrams efficiently using a dictionary.
# Character Counting: Count the frequency of each character in the string (using an array or a Counter from the collections module) and use that as the key.
# Why: This approach can be more efficient than sorting, especially for longer strings, as it runs in linear time with respect to the length of the string.
# 5. Associated Time and Space Complexity Explained
# Time Complexity:

# Sorting Approach:
# For each string of length m, sorting takes O(m log m). If there are n strings, the overall complexity is O(n * m log m).
# Character Counting Approach:
# Counting characters is O(m) for each string, so the overall complexity becomes O(n * m).
# Space Complexity:

# Both approaches require additional space for the dictionary to store grouped anagrams. In the worst case, if all strings are unique, the space complexity is O(n) for the dictionary.
# The character counting approach may require additional space for the count array or Counter, which is O(1) since the number of different characters (a-z) is constant.


class Solution:
    def group_anagrams(self, strs):
        anagrams = {}  # Dictionary to hold the grouped anagrams

        for s in strs:
            # Sort the string to get the anagram key
            key = ''.join(sorted(s))
            # Group anagrams in the dictionary
            if key in anagrams:
                anagrams[key].append(s)
            else:
                anagrams[key] = [s]

        # Return the grouped anagrams as a list of lists
        return list(anagrams.values())

# Example usage
solution = Solution()
result = solution.group_anagrams(["bat", "tab", "tap", "pat", "cat", "act", "god", "dog"])
print(result)  # Output: [["bat", "tab"], ["tap", "pat"], ["cat", "act"], ["god", "dog"]]
