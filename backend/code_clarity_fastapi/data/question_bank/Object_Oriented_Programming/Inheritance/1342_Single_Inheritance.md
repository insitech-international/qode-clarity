# Single Inheritance
## Metadata
- **ID**: OOP-004-B
- **Title**: Implementing and Using Single Inheritance in Python
- **Difficulty**: Medium
- **Category**: Object-Oriented Programming
- **Subcategory**: Inheritance
- **Real Life Domains**: Software Design, Code Reusability, Object Hierarchies
## Problem Description
Demonstrate your understanding of single inheritance in Python by solving the following problems:
1. Create a base class `Animal` with methods `eat()` and `sleep()`. Implement derived classes `Dog`, `Cat`, and `Bird`, each adding their specific methods (e.g., `bark()` for Dog, `meow()` for Cat, `fly()` for Bird).
2. Design a `Vehicle` base class with attributes like `make`, `model`, and `year`, and a method `start_engine()`. Create subclasses `Car` and `Motorcycle`, adding specific attributes and methods (e.g., `num_doors` for Car, `has_sidecar` for Motorcycle).
3. Implement a `Shape` base class with methods `area()` and `perimeter()`. Create derived classes `Circle`, `Rectangle`, and `Triangle`, implementing these methods appropriately for each shape.
4. Create a `Person` base class with attributes `name` and `age`. Implement a `Student` subclass that adds `student_id` and `major` attributes, and an `Employee` subclass that adds `employee_id` and `salary` attributes.
5. Design a `BankAccount` base class with methods `deposit()` and `withdraw()`. Implement `SavingsAccount` and `CheckingAccount` subclasses, adding specific features like `interest_rate` for SavingsAccount and `overdraft_limit` for CheckingAccount.
## Constraints
- Use proper inheritance syntax (`class DerivedClass(BaseClass):`)
- Implement `__init__` methods in both base and derived classes, using `super()` in derived classes to call the base class initializer
- Override methods from the base class in derived classes where appropriate
- Use instance variables and methods effectively to represent the attributes and behaviors of each class
## Notes
- Remember that single inheritance allows a class to inherit from only one base class
- Use `super()` to call methods from the parent class, especially in the `__init__` method
- Consider which attributes and methods should be in the base class vs. the derived classes
- Be mindful of method overriding and extending functionality in derived classes
- Think about how to use inheritance to promote code reuse and maintain a clear class hierarchy
## Version
### Version 1: Basic Inheritance
Implement problems 1 and 2, focusing on basic inheritance concepts and method overriding.

### Version 2: Method Implementation
Solve problem 3, emphasizing the implementation of abstract methods in derived classes.

### Version 3: Complex Attributes
Address problems 4 and 5, dealing with more complex attributes and behaviors in derived classes.