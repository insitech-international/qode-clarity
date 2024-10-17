# Multiple Inheritance

## Metadata

- **ID**: OOP-004-A
- **Title**: Implementing and Managing Multiple Inheritance in Python
- **Difficulty**: Hard
- **Category**: Object-Oriented Programming
- **Subcategory**: Inheritance
- **Real Life Domains**: Complex System Design, Mixin Classes, Framework Development

## Problem Description

Demonstrate your understanding of multiple inheritance in Python by solving the following problems:

1. Create a class hierarchy for a game character system. Implement base classes `Character`, `Mage`, `Warrior`, and `Healer`. Then create a `Paladin` class that inherits from both `Warrior` and `Healer`. Ensure proper use of `super()` to handle method resolution.
2. Design a logging system using multiple inheritance. Create mixin classes `ConsoleLoggerMixin` and `FileLoggerMixin`. Implement a `DataProcessor` class that inherits from both mixin classes to enable logging to console and file simultaneously.
3. Implement a `Shape` class hierarchy with `TwoDimensionalShape` and `ThreeDimensionalShape` as base classes. Create mixin classes `ColorMixin` and `MaterialMixin`. Then create classes like `ColoredSquare` (inherits from `TwoDimensionalShape` and `ColorMixin`) and `ColoredCube` (inherits from `ThreeDimensionalShape`, `ColorMixin`, and `MaterialMixin`).
4. Create a `Vehicle` class hierarchy with `LandVehicle` and `WaterVehicle` as base classes. Implement a `AmphibiousVehicle` class that inherits from both. Add method `travel()` to each class and demonstrate how method resolution order works when calling `travel()` on an `AmphibiousVehicle` instance.
5. Design a `Database` class hierarchy. Create base classes `SQLDatabase` and `NoSQLDatabase`, and mixin classes `Encryptable` and `Compressable`. Implement a `SecureSQL` class that inherits from `SQLDatabase` and both mixin classes. Demonstrate how to use `super()` to properly initialize all parent classes.

## Constraints

- Properly manage the method resolution order (MRO) in your multiple inheritance hierarchies.
- Use `super()` correctly to call methods from parent classes.
- Avoid naming conflicts in inherited methods and attributes.
- Implement `__init__` methods that properly initialize all parent classes.

## Notes

- The Method Resolution Order (MRO) in Python follows the C3 linearization algorithm.
- Be cautious of the diamond problem in multiple inheritance and understand how Python resolves it.
- Mixin classes are a powerful way to add functionality to classes without deep inheritance hierarchies.
- Consider using `super().__init__()` in your `__init__` methods to ensure proper initialization of parent classes.
- Use `ClassName.mro()` or `super()` to inspect and understand the method resolution order of your classes.

## Version

### Version 1: Basic Multiple Inheritance

Implement the game character system as described in problem 1, focusing on correct use of `super()` and method resolution.

### Version 2: Mixin Classes

Solve problem 2, implementing the logging system using mixin classes. This version emphasizes the use of mixins for adding functionality.

### Version 3: Complex Hierarchies

Tackle problems 3, 4, and 5, which involve more complex inheritance hierarchies and demonstrate advanced uses of multiple inheritance in Python.
