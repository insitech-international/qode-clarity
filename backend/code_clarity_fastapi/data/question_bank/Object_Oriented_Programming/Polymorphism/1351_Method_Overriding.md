# Method Overriding
## Metadata
- **ID**: OOP-005-A
- **Title**: Implementing Method Overriding in Python
- **Difficulty**: Medium
- **Category**: Object-Oriented Programming
- **Subcategory**: Polymorphism
- **Real Life Domains**: Software Design, UI Frameworks, Game Development
## Problem Description
Demonstrate your understanding of method overriding in Python by solving the following problems:
1. Create a base class `Shape` with a method `area()`. Implement derived classes `Circle`, `Rectangle`, and `Triangle`, overriding the `area()` method in each to calculate the appropriate area.
2. Design a `Vehicle` base class with a method `make_sound()`. Create subclasses `Car`, `Motorcycle`, and `Truck`, each overriding `make_sound()` to return a vehicle-specific sound.
3. Implement an `Animal` base class with methods `speak()` and `move()`. Create derived classes `Dog`, `Cat`, and `Bird`, overriding both methods to provide animal-specific behaviors.
4. Create a `Person` base class with a method `introduce()`. Implement subclasses `Student` and `Teacher`, overriding `introduce()` to include role-specific information.
5. Design a `PaymentProcessor` base class with a method `process_payment()`. Create subclasses for different payment methods (e.g., `CreditCardProcessor`, `PayPalProcessor`), overriding `process_payment()` to handle method-specific logic.
## Constraints
- Use proper inheritance syntax and method overriding techniques
- Ensure that overridden methods in derived classes have the same name and parameters as in the base class
- Implement `__init__` methods where necessary, using `super()` to call the base class initializer
- Use type hints for method parameters and return values
## Notes
- Remember that method overriding allows a subclass to provide a specific implementation for a method that is already defined in its superclass
- Consider using the `@override` decorator (available in Python 3.12+) to explicitly mark overridden methods
- Be mindful of the method signature when overriding; it should generally match the base class method
- Think about scenarios where you might want to extend the base class method rather than completely replace it
- Consider implementing a `super().method()` call within the overridden method if you need to include the base class behavior
## Version
### Version 1: Basic Method Overriding
Implement problems 1 and 2, focusing on simple method overriding in geometric shapes and vehicles.

### Version 2: Multiple Method Overriding
Solve problem 3, emphasizing overriding multiple methods in a single class hierarchy.

### Version 3: Complex Overriding Scenarios
Address problems 4 and 5, dealing with more complex scenarios that might involve extending base class behavior or handling different types of data in overridden methods.