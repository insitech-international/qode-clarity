# Operator Overloading
## Metadata
- **ID**: OOP-005-B
- **Title**: Implementing Operator Overloading in Python
- **Difficulty**: Medium to Hard
- **Category**: Object-Oriented Programming
- **Subcategory**: Polymorphism
- **Real Life Domains**: Mathematical Operations, Custom Data Structures, Financial Modeling
## Problem Description
Demonstrate your understanding of operator overloading in Python by solving the following problems:
1. Create a `Vector` class representing a 2D vector. Overload the `+`, `-`, and `*` operators to perform vector addition, subtraction, and scalar multiplication respectively. Also, implement the `==` operator for vector comparison.
2. Implement a `Fraction` class with numerator and denominator. Overload arithmetic operators (`+`, `-`, `*`, `/`) to perform fraction arithmetic. Also, overload comparison operators (`<`, `>`, `==`, `!=`).
3. Design a `Matrix` class representing a 2D matrix. Overload the `+` and `*` operators for matrix addition and matrix multiplication. Implement the `==` operator for matrix comparison and the `[]` operator for accessing elements.
4. Create a `Money` class to represent monetary values with a specific currency. Overload arithmetic operators to handle operations between Money objects, considering currency conversion if necessary. Implement comparison operators as well.
5. Implement a custom `List` class that behaves like a Python list but with additional features. Overload the `+` operator for list concatenation, `*` for repetition, `[]` for indexing and slicing, and implement `__len__` for the `len()` function.
## Constraints
- Use special methods (`__add__`, `__sub__`, etc.) for operator overloading
- Ensure that operations are commutative where applicable (e.g., `a + b` should equal `b + a`)
- Implement `__repr__` and `__str__` methods for proper object representation
- Handle edge cases and raise appropriate exceptions when necessary
- Use type hints for method parameters and return values
## Notes
- Remember that operator overloading allows you to define how built-in operators work with objects of your custom classes
- Consider implementing right-hand operations (e.g., `__radd__`) for operations with built-in types
- Be mindful of the return type of your overloaded operators; they should typically return a new object
- Think about how to handle operations between objects of different types (e.g., adding an int to your custom numeric class)
- Remember to maintain the expected behavior of operators; users of your class should be able to use it intuitively
## Version
### Version 1: Basic Arithmetic Overloading
Implement problems 1 and 2, focusing on overloading basic arithmetic and comparison operators.

### Version 2: Complex Data Structure Overloading
Solve problem 3, emphasizing operator overloading for more complex mathematical structures like matrices.

### Version 3: Advanced Overloading Scenarios
Address problems 4 and 5, dealing with more advanced scenarios such as currency handling and custom container classes.