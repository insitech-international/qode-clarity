# Instance and Class Variables
## Metadata
- **ID**: OOP-002-B
- **Title**: Using Instance and Class Variables in Python
- **Difficulty**: Medium
- **Category**: Object-Oriented Programming
- **Subcategory**: Classes and Objects
- **Real Life Domains**: Product Inventory Management, Financial Systems, Multi-User Applications
## Problem Description
Demonstrate your understanding of instance and class variables in Python by solving the following problems:
1. Create a `Product` class for an e-commerce system. Use instance variables for product-specific details (name, price, SKU) and class variables for store-wide information (store name, tax rate). Implement methods to calculate the final price including tax and to update the store-wide tax rate.
2. Implement a `BankAccount` class with instance variables for account number and balance, and a class variable for interest rate. Add methods to apply interest to all accounts simultaneously and to change the interest rate bank-wide. Consider how this might be used in a real banking system during economic changes.
3. Design a `User` class for a multi-user application. Use instance variables for user-specific data (username, email, last_login) and class variables for application-wide settings (max_login_attempts, password_expiry_days). Implement methods to authenticate users and to update application-wide security settings.
4. Create a `Sensor` class for an IoT system. Use instance variables for sensor-specific data (location, current_reading) and class variables for system-wide thresholds (alert_temperature, data_transmission_interval). Implement methods to update readings, check against thresholds, and modify system-wide settings across all sensors.
5. Implement a `Employee` class for a company's HR system. Use instance variables for employee details (name, position, salary) and class variables for company-wide information (company_name, total_employees, average_salary). Add methods to hire/fire employees, give raises, and automatically update company-wide statistics.
## Constraints
- Clearly distinguish between instance variables and class variables in your implementations.
- Use proper naming conventions for instance variables (self.variable) and class variables (ClassName.variable).
- Implement class methods using the `@classmethod` decorator where appropriate.
- Ensure that modifications to class variables affect all instances of the class.
- Consider thread safety when modifying class variables in a multi-threaded environment.
## Notes
- Remember that class variables are shared among all instances of a class.
- Be cautious when using mutable class variables, as changes will affect all instances.
- Consider using class methods for operations that need to access or modify class variables.
- Instance variables are unique to each instance and are typically defined in the `__init__` method.
- Think about scenarios where you might need to override a class variable with an instance variable.
## Version
### Version 1: Basic Usage
Implement problems 1 and 2, focusing on basic usage of instance and class variables in product and banking scenarios.

### Version 2: Multi-User Systems
Solve problem 3, emphasizing the use of instance and class variables in a multi-user application context.

### Version 3: Advanced Scenarios
Address problems 4 and 5, dealing with more complex scenarios such as IoT systems and HR management, where the interplay between instance and class variables becomes more intricate.