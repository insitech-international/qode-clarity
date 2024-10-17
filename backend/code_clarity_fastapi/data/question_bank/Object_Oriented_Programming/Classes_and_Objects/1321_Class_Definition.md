# Class Definition
## Metadata
- **ID**: OOP-002-A
- **Title**: Defining and Using Classes in Python
- **Difficulty**: Easy to Medium
- **Category**: Object-Oriented Programming
- **Subcategory**: Classes and Objects
- **Real Life Domains**: Financial Systems, Content Management, Scientific Simulations
## Problem Description
Demonstrate your understanding of class definition and usage in Python by solving the following problems:
1. Create a `StockPortfolio` class for a financial application. Include attributes for owner name, list of stocks, and total value. Implement methods for buying stocks, selling stocks, and calculating the current portfolio value based on real-time stock prices (you can simulate this with random price fluctuations).
2. Design a `ContentManagementSystem` class for a digital publishing platform. Include attributes for articles, authors, and categories. Implement methods for adding/removing articles, assigning authors, categorizing content, and generating analytics reports on content performance.
3. Implement a `ChemicalReaction` class for a chemistry simulation software. Include attributes for reactants, products, reaction rate, and equilibrium constant. Add methods to calculate reaction progress, predict product yields, and simulate the effect of changing conditions (temperature, pressure) on the reaction.
4. Create a `SmartHome` class for an IoT home automation system. Include attributes for connected devices, room temperatures, and energy consumption. Implement methods to add/remove devices, adjust temperatures, monitor energy usage, and create automation routines (e.g., "night mode" that adjusts all connected devices).
5. Design a `MachineLearningModel` class for an AI research platform. Include attributes for model type, training data, hyperparameters, and performance metrics. Implement methods for training the model, making predictions, evaluating performance, and fine-tuning hyperparameters.
## Constraints
- Follow Python naming conventions and PEP 8 style guide.
- Use type hints for method parameters and return values.
- Implement proper error handling where necessary.
- Use docstrings to document your classes and methods.
- Consider implementing relevant magic methods (`__str__`, `__repr__`, `__eq__`, etc.) where appropriate.
## Notes
- Remember to use the `__init__` method for proper object initialization.
- Consider using properties (`@property` decorator) for controlled attribute access where appropriate.
- Think about which methods should be instance methods, class methods, or static methods.
- For complex classes, consider breaking functionality into smaller, focused methods.
- Think about how your class might be extended or used as a base class for more specialized classes.
## Version
### Version 1: Basic Class Implementation
Implement problems 1 and 2, focusing on basic class structure and methods for financial and content management systems.

### Version 2: Scientific and IoT Applications
Solve problems 3 and 4, emphasizing more complex class designs for scientific simulations and IoT systems.

### Version 3: Advanced AI Class Design
Address problem 5, dealing with the complex scenario of designing a class for machine learning models, incorporating advanced OOP concepts.