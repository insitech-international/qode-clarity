# Properties
## Metadata
- **ID**: OOP-003-B
- **Title**: Implementing and Using Properties in Python
- **Difficulty**: Medium
- **Category**: Object-Oriented Programming
- **Subcategory**: Encapsulation
- **Real Life Domains**: Data Validation, Computed Attributes, API Design
## Problem Description
Demonstrate your understanding of properties in Python by solving the following problems:
1. Create a `Rectangle` class with properties for length and width. Ensure that these values cannot be set to negative numbers. Implement a read-only property for area.
2. Design a `Temperature` class that internally stores temperature in Celsius. Implement properties to get and set the temperature in Celsius, Fahrenheit, and Kelvin.
3. Implement a `Person` class with properties for name and age. Add a property for birth_year that is automatically calculated based on the current year and the person's age. Ensure that changing the birth_year updates the age accordingly.
4. Create an `EmailAccount` class with a property for email_address. Implement validation in the setter to ensure the email address is in a valid format. Add a property for domain that extracts the domain from the email address.
5. Design a `Playlist` class with a private attribute for tracks (a list of song titles). Implement properties to add tracks, remove tracks, and get the current track list. Add a property for playlist_duration that calculates the total duration of all tracks.
## Constraints
- Use the @property decorator to create getter methods.
- Implement setter methods using the @<property_name>.setter decorator where needed.
- Ensure proper validation is performed in setter methods.
- Use properties to create computed attributes where appropriate.
- Implement read-only properties for attributes that should not be directly set.
## Notes
- Properties allow you to use simple attribute access syntax while executing method code.
- Consider using properties to add validation, computation, or to control access to attributes.
- Remember that properties can help in maintaining backwards compatibility when refactoring code.
- You can create read-only properties by only implementing the getter method.
- Properties can be used to create "virtual" attributes that don't directly correspond to stored data.
## Version
### Version 1: Basic Property Implementation
Implement problems 1 and 2, focusing on basic property usage for data validation and unit conversion.

### Version 2: Computed Properties
Solve problem 3, emphasizing the use of properties for computed attributes and interdependent properties.

### Version 3: Advanced Property Scenarios
Address problems 4 and 5, dealing with more complex scenarios such as email validation and managing collections through properties.