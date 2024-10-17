# Access Modifiers
## Metadata
- **ID**: OOP-003-A
- **Title**: Implementing Access Control in Python Classes
- **Difficulty**: Medium
- **Category**: Object-Oriented Programming
- **Subcategory**: Encapsulation
- **Real Life Domains**: Data Privacy, API Design, Security
## Problem Description
Demonstrate your understanding of access modifiers and encapsulation in Python by solving the following problems:
1. Create a `BankAccount` class with a private attribute for balance. Implement public methods for deposit and withdrawal, and a method to check the balance. Ensure that the balance cannot be accessed or modified directly from outside the class.
2. Design a `User` class with a private attribute for password. Implement a method to change the password that requires the old password for verification. Add a method to authenticate the user.
3. Implement a `Car` class with protected attributes for fuel_level and engine_temperature. Create public methods to start the engine, drive, and stop, which interact with these protected attributes. Add a public method to check the car's status.
4. Create a `FileManager` class with a private method for reading file contents and a public method for displaying file information. The public method should use the private method internally but not expose the file contents directly.