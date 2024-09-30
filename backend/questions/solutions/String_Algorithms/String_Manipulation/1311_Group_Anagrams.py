from dataclasses import dataclass
from typing import List

@dataclass
class Solution:
    problem_classification: str
    problem_explanation: str
    approach_explanation: str
    algorithm_steps: str
    complexity_analysis: str
    code_implementation: str

def get_solution(question_id: int) -> Solution:
    return Solution(
# CLASSIFICATION REASON:
        problem_classification="""
This problem is classified as String Algorithm/String Manipulation because:
1. It deals with anagrams, which are rearrangements of characters in strings.
2. The core operations involve transforming strings through sorting or character counting.
3. It utilizes mathematical concepts like combinatorics and hashing for string comparisons.
        """.strip(),

# LOGIC EXPLANATION:
        problem_explanation="""
Anagrams are words or phrases formed by rearranging the letters of another word or phrase.
For example, "bat" and "tab" are anagrams, as are "god" and "dog".
The goal is to group all anagrams together from a given list of strings.

Key Points:
1. Two words are anagrams if they have the same characters with the same frequencies.
2. The order of characters doesn't matter for anagrams.
3. The task is to find all such groups and return them as lists.
        """.strip(),

# BEST APPROACH:
        approach_explanation="""
The optimal approach uses character counting instead of sorting:
1. It's more efficient, especially for longer strings.
2. Avoids the computational cost of sorting each string.
3. Creates a unique identifier for each anagram group based on character frequencies.

Process:
1. Iterate through each string in the input list.
2. Count the frequency of each character in the string.
3. Use this count as a key to group anagrams together.
4. Return the grouped anagrams as a list of lists.
        """.strip(),

# PSEUDOCODE:
        algorithm_steps="""
1. Initialize an empty dictionary to store anagram groups.
2. For each string in the input list:
   a. Create a character count array of size 26 (for lowercase letters a-z).
   b. Iterate through each character in the string:
      - Increment the count for that character in the array.
   c. Convert the count array to a tuple to use as a dictionary key.
   d. If the key exists in the dictionary, append the current string to its list.
   e. If the key doesn't exist, create a new list with the current string.
3. Return the values of the dictionary (lists of anagrams).
        """.strip(),

# COMPLEXITY:
        complexity_analysis="""
Time Complexity: O(n * m)
- n is the number of strings in the input list.
- m is the average length of the strings.
- We iterate through each string (n) and then through each character in the string (m).

Space Complexity: O(n * m)
- In the worst case, we store all strings in our dictionary.
- The space for character count arrays is negligible compared to storing the strings.
        """.strip(),

# IMPLEMENTATION:
        code_implementation="""
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        anagrams = {}
        for s in strs:
            char_count = [0] * 26
            for char in s:
                char_count[ord(char) - ord('a')] += 1
            key = tuple(char_count)
            anagrams.setdefault(key, []).append(s)
        return list(anagrams.values())

# Example usage
solution = Solution()
result = solution.groupAnagrams(["eat","tea","tan","ate","nat","bat"])
print(result)  # Output: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
        """.strip()
    )

# Example of how to use this structure
solution = get_solution(1311)  # Assuming 1311 is the ID for the Group Anagrams problem
print(solution.problem_classification)
print(solution.problem_explanation)