import React from "react";
import styled from "styled-components";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";

const CarouselWrapper = styled.div`
  margin-bottom: 3rem;
  max-width: 80vw;
  margin: 0 auto;

  .carousel .control-dots .dot {
    box-shadow: none;
    background: #2c3e50;
    opacity: 0.4;
  }

  .carousel .control-dots .dot.selected {
    opacity: 1;
  }
`;

const CategoryCard = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.reverse ? "row-reverse" : "row")};
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  height: 400px;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const MindMapImage = styled.img`
  width: 100%;
  height: 100%;
  max-width: 50%;
  max-height: 95%;
  object-fit: contain;
  border-radius: 8px;
`;

const CategoryContent = styled.div`
  width: 60%;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const CategoryName = styled.h3`
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const CategoryDescription = styled.p`
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  align-self: center;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const categories = [
  {
    name: "String Algorithms",
    image: "/images/category_diagrams/string_algorithms.png",
  },
  {
    name: "Dynamic Programming",
    image: "/images/category_diagrams/dynamic_programming.png",
  },
  {
    name: "Sorting & Searching",
    image: "/images/category_diagrams/searching_and_sorting.png",
  },
  {
    name: "Backtracking & Recursion",
    image: "/images/category_diagrams/backtracking_and_recursion.png",
  },
  {
    name: "Greedy Algorithms",
    image: "/images/category_diagrams/greedy_algorithms.png",
  },
  {
    name: "Advanced Data Structures",
    image: "/images/category_diagrams/advanced_data_structures.png",
  },
  {
    name: "Tree & Graph Algorithms",
    image: "/images/category_diagrams/tree_and_graph_algorithms.png",
  },
  {
    name: "Heap & Priority Queue",
    image: "/images/category_diagrams/heap_and_priority_queue.png",
  },
  {
    name: "Linked List Techniques",
    image: "/images/category_diagrams/linked_list_techniques.png",
  },
  {
    name: "Bit Manipulation",
    image: "/images/category_diagrams/bit_manipulation.png",
  },
  {
    name: "Math & Number Theory",
    image: "/images/category_diagrams/math_and_number_theory.png",
  },
  {
    name: "System Design & OOP",
    image: "/images/category_diagrams/system_design_and_oop.png",
  },
  {
    name: "Python Specific Concepts",
    image: "/images/category_diagrams/python_specific_concepts.png",
  },
  {
    name: "Concurrency & Parallel Programming",
    image: "/images/category_diagrams/concurrency_and_parallel_programming.png",
  },
  {
    name: "Array & String Manipulation",
    image: "/images/category_diagrams/array_and_string_manipulation.png",
  },
];

const CategoryCarousel = () => {
  const getCategoryDescription = (category) => {
    const descriptions = {
      "String Algorithms":
        "Techniques for working with text, like finding patterns or manipulating words and sentences in clever ways.",
      "Dynamic Programming":
        "A method for solving complex problems by breaking them down into simpler steps and remembering the results to avoid repeated work.",
      "Sorting & Searching":
        "Ways to organize information and find specific items quickly, like arranging a list of names alphabetically or finding a book in a library.",
      "Backtracking & Recursion":
        "Problem-solving approaches that involve trying different possibilities and using a function that calls itself to solve smaller versions of the same problem.",
      "Greedy Algorithms":
        "*How it works: Makes the best choice at each step (locally optimal). *Best for: Problems that can be broken down into smaller, solvable parts (clear substructures). *Used in: GPS navigation, scheduling meetings, and file compression.",
      "Advanced Data Structures":
        "Specialized ways to store and organize data for efficient access and modification, like a family tree or a city map.",
      "Tree & Graph Algorithms":
        "Efficient techniques for solving problems in hierarchical or interconnected systems, like family trees or network routing.",
      "Heap & Priority Queue":
        "Special data structures that always keep the most important item readily available, like a to-do list that automatically sorts tasks by urgency.",
      "Linked List Techniques":
        "Ways to work with chains of data where each piece points to the next, like a scavenger hunt where each clue leads to the next.",
      "Bit Manipulation":
        "Tricks for working directly with the ones and zeros that computers use, like using a single number to represent a set of yes/no flags.",
      "Math & Number Theory":
        "Applying mathematical concepts and properties of numbers to solve problems, like finding patterns in sequences or working with very large numbers efficiently.",
      "System Design & OOP":
        "Approaches for organizing code into reusable objects and designing large-scale software systems, like planning the layout and functionality of a complex application.",
      "Python Specific Concepts":
        "Unique features and best practices in Python programming, such as list comprehensions or context managers, that make coding more efficient and readable.",
      "Concurrency & Parallel Programming":
        "Techniques for making programs do multiple tasks at once or use multiple processors efficiently, like a chef managing multiple dishes cooking simultaneously.",
      "Array & String Manipulation":
        "Methods for working with collections of items or text, such as finding specific elements, rearranging items, or modifying parts of a string.",
    };
    return (
      descriptions[category.name] ||
      "Explore challenging problems and efficient solutions in computer science and programming."
    );
  };

  return (
    <CarouselWrapper>
      <Carousel
        showArrows={false}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        showIndicators={true}
        centerMode={false}
      >
        {categories.map((category, index) => (
          <CategoryCard key={index} reverse={index % 2 !== 0}>
            <MindMapImage
              src={category.image}
              alt={`${category.name} mind map`}
            />
            <CategoryContent>
              <CategoryName>{category.name}</CategoryName>
              <CategoryDescription>
                {getCategoryDescription(category)}
              </CategoryDescription>
              <CTAButton
                to={`/category/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                View All Questions
              </CTAButton>
            </CategoryContent>
          </CategoryCard>
        ))}
      </Carousel>
    </CarouselWrapper>
  );
};

export default CategoryCarousel;
