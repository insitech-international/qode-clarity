import os

# Directory and file structure in a nested dictionary format
structure = {
    "Basics": {
        "Variables_and_Data_Types.md": None,
        "Control_Flow": {
            "Conditional_Statements.md": None,
            "Loops.md": None,
        },
        "Functions": {
            "Function_Basics.md": None,
            "Lambda_Functions.md": None,
            "Decorators.md": None,
        },
        "Modules_and_Packages": {
            "Creating_Modules.md": None,
            "Importing_Modules.md": None,
            "Package_Structure.md": None,
        },
    },
    "Data_Structures": {
        "Lists": {
            "List_Operations.md": None,
            "List_Comprehensions.md": None,
        },
        "Tuples": {
            "Tuple_Basics.md": None,
            "Named_Tuples.md": None,
        },
        "Dictionaries": {
            "Dictionary_Operations.md": None,
            "Dictionary_Comprehensions.md": None,
        },
        "Sets": {
            "Set_Operations.md": None,
            "Frozen_Sets.md": None,
        },
        "Strings": {
            "String_Operations.md": None,
            "String_Formatting.md": None,
        },
        "Arrays": {
            "Array_Module.md": None,
            "Numpy_Arrays.md": None,
        },
    },
    "Object_Oriented_Programming": {
        "Classes_and_Objects": {
            "Class_Definition.md": None,
            "Instance_and_Class_Variables.md": None,
        },
        "Inheritance": {
            "Single_Inheritance.md": None,
            "Multiple_Inheritance.md": None,
        },
        "Polymorphism": {
            "Method_Overriding.md": None,
            "Operator_Overloading.md": None,
        },
        "Encapsulation": {
            "Access_Modifiers.md": None,
            "Properties.md": None,
        },
        "Abstract_Classes_and_Interfaces": {
            "ABC_Module.md": None,
            "Protocols.md": None,
        },
    },
    "Advanced_Python_Concepts": {
        "Generators_and_Iterators": {
            "Generator_Functions.md": None,
            "Iterator_Protocol.md": None,
        },
        "Context_Managers": {
            "With_Statement.md": None,
            "Contextlib_Module.md": None,
        },
        "Metaclasses": {
            "Metaclass_Basics.md": None,
            "Custom_Metaclasses.md": None,
        },
        "Descriptors": {
            "Property_Descriptors.md": None,
            "Non-Data_Descriptors.md": None,
        },
        "Coroutines_and_AsyncIO": {
            "Asyncio_Basics.md": None,
            "Asynchronous_Comprehensions.md": None,
        },
    },
    "Exception_Handling": {
        "Try_Except_Blocks.md": None,
        "Custom_Exceptions.md": None,
        "Context_Managers_for_Exception_Handling.md": None,
    },
    "File_Handling": {
        "File_IO_Operations.md": None,
        "Working_with_CSV.md": None,
        "JSON_Processing.md": None,
        "XML_Parsing.md": None,
    },
    "Networking": {
        "Socket_Programming": {
            "TCP_Sockets.md": None,
            "UDP_Sockets.md": None,
        },
        "HTTP_Requests": {
            "Requests_Library.md": None,
            "AIOHTTP_for_Async_Requests.md": None,
        },
        "Web_Scraping": {
            "BeautifulSoup.md": None,
            "Scrapy_Framework.md": None,
        },
    },
    "Database_Operations": {
        "SQL_Databases": {
            "SQLite3.md": None,
            "PostgreSQL_with_Psycopg2.md": None,
        },
        "NoSQL_Databases": {
            "MongoDB_with_PyMongo.md": None,
            "Redis_with_redis-py.md": None,
        },
        "ORM": {
            "SQLAlchemy.md": None,
            "Django_ORM.md": None,
        },
    },
    "Web_Development": {
        "Flask": {
            "Routing.md": None,
            "Templates.md": None,
            "Flask_RESTful.md": None,
        },
        "Django": {
            "Models.md": None,
            "Views.md": None,
            "Django_REST_Framework.md": None,
        },
        "FastAPI": {
            "Path_Operations.md": None,
            "Dependency_Injection.md": None,
        },
    },
    "Testing": {
        "Unit_Testing": {
            "Unittest_Framework.md": None,
            "Pytest.md": None,
        },
        "Mocking": {
            "Unittest_mock.md": None,
            "Pytest_monkeypatch.md": None,
        },
        "Test_Coverage": {
            "Coverage_py.md": None,
        },
    },
    "Performance_Optimization": {
        "Profiling": {
            "cProfile.md": None,
            "Memory_Profiler.md": None,
        },
        "Code_Optimization": {
            "Algorithmic_Efficiency.md": None,
            "Cython_for_Speed.md": None,
        },
    },
    "Concurrency": {
        "Threading": {
            "Thread_Basics.md": None,
            "Thread_Synchronization.md": None,
        },
        "Multiprocessing": {
            "Process_Creation.md": None,
            "Inter-Process_Communication.md": None,
        },
        "Asyncio": {
            "Event_Loops.md": None,
            "Asynchronous_Context_Managers.md": None,
        },
        "Concurrent_Futures": {
            "ThreadPoolExecutor.md": None,
            "ProcessPoolExecutor.md": None,
        },
        "Mixing_Concurrency_Models": {
            "Combining_Threading_with_Asyncio.md": None,
            "Mixing_Threading_and_Multiprocessing.md": None,
            "Asyncio_and_Multiprocessing.md": None,
            "Best_Practices_for_Mixed_Concurrency.md": None,
        },
    },
    "Security": {
        "Input_Validation.md": None,
        "Cryptography": {
            "Hashing_with_Hashlib.md": None,
            "Encryption_with_Cryptography.md": None,
        },
        "Web_Security": {
            "CSRF_Protection.md": None,
            "XSS_Prevention.md": None,
        },
        "Authentication_and_Authorization.md": None,
        "OWASP_Best_Practices.md": None,
        "API_Security.md": None,
    },
    "Data_Science_and_Machine_Learning": {
        "NumPy": {
            "Array_Operations.md": None,
            "Mathematical_Functions.md": None,
        },
        "Pandas": {
            "DataFrame_Operations.md": None,
            "Data_Cleaning.md": None,
        },
        "Matplotlib_and_Seaborn": {
            "Basic_Plotting.md": None,
            "Advanced_Visualizations.md": None,
        },
        "Scikit-learn": {
            "Preprocessing.md": None,
            "Model_Selection.md": None,
            "Model_Evaluation.md": None,
            "Supervised_Learning.md": None,
            "Unsupervised_Learning.md": None,
        },
        "Machine_Learning_Pipelines": {
            "Building_End_to_End_Pipelines.md": None,
            "Model_Deployment_with_Flask.md": None,
            "Model_Deployment_with_FastAPI.md": None,
        },
        "Deep_Learning": {
            "Introduction_to_TensorFlow.md": None,
            "Introduction_to_PyTorch.md": None,
            "Model_Training.md": None,
            "Transfer_Learning.md": None,
            "Model_Optimization.md": None,
        },
    },
    "Deployment_and_DevOps": {
        "Virtual_Environments": {
            "Venv.md": None,
            "Virtualenv.md": None,
        },
        "Package_Management": {
            "Pip.md": None,
            "Poetry.md": None,
        },
        "Containerization": {
            "Docker_for_Python.md": None,
            "Docker_Compose.md": None,
        },
        "Orchestration_and_Automation": {
            "Kubernetes_Basics.md": None,
            "Ansible_for_Automation.md": None,
            "Terraform_Basics.md": None,
        },
        "CI_CD": {
            "GitHub_Actions.md": None,
            "Jenkins_for_Python.md": None,
        },
        "Serverless": {
            "AWS_Lambda_Basics.md": None,
            "GCP_Functions.md": None,
            "Azure_Functions.md": None,
        },
    },
    "Design_Patterns": {
        "Creational_Patterns": {
            "Singleton.md": None,
            "Factory_Method.md": None,
        },
        "Structural_Patterns": {
            "Adapter.md": None,
            "Decorator.md": None,
        },
        "Behavioral_Patterns": {
            "Observer.md": None,
            "Strategy.md": None,
        },
    },
"Algorithms_and_Data_Structures": {
    "Searching": {
        "Linear_Search.md": None,
        "Binary_Search.md": None,
        "Jump_Search.md": None,
        "Interpolation_Search.md": None,
        "Exponential_Search.md": None,
        "Sublist_Search.md": None,
    },
    "Sorting": {
        "Bubble_Sort.md": None,
        "Selection_Sort.md": None,
        "Insertion_Sort.md": None,
        "Merge_Sort.md": None,
        "Quick_Sort.md": None,
        "Heap_Sort.md": None,
        "Counting_Sort.md": None,
        "Radix_Sort.md": None,
        "Bucket_Sort.md": None,
        "Shell_Sort.md": None,
    },
    "Graph_Algorithms": {
        "Graph_Representation.md": None,
        "Depth_First_Search.md": None,
        "Breadth_First_Search.md": None,
        "Dijkstra's_Algorithm.md": None,
        "Bellman-Ford_Algorithm.md": None,
        "Floyd-Warshall_Algorithm.md": None,
        "Kruskal's_Algorithm.md": None,
        "Prim's_Algorithm.md": None,
        "Topological_Sort.md": None,
        "Strongly_Connected_Components.md": None,
    },
    "Dynamic_Programming": {
        "Memoization.md": None,
        "Tabulation.md": None,
        "Fibonacci_Sequence.md": None,
        "Knapsack_Problem.md": None,
        "Longest_Common_Subsequence.md": None,
        "Longest_Increasing_Subsequence.md": None,
        "Edit_Distance.md": None,
        "Matrix_Chain_Multiplication.md": None,
        "Coin_Change_Problem.md": None,
    },
    "Tree_Algorithms": {
        "Binary_Tree_Traversals.md": None,
        "Binary_Search_Tree.md": None,
        "AVL_Tree.md": None,
        "Red-Black_Tree.md": None,
        "B-Tree.md": None,
        "Segment_Tree.md": None,
        "Fenwick_Tree.md": None,
        "Trie.md": None,
    },
    "String_Algorithms": {
        "KMP_Algorithm.md": None,
        "Rabin-Karp_Algorithm.md": None,
        "Z_Algorithm.md": None,
        "Manacher's_Algorithm.md": None,
        "Suffix_Array_and_LCP.md": None,
        "Aho-Corasick_Algorithm.md": None,
    },
    "Advanced_Data_Structures": {
        "Disjoint_Set_Union_Find.md": None,
        "Bloom_Filter.md": None,
        "Skip_List.md": None,
    },
    "Backtracking": {
        "N-Queens_Problem.md": None,
        "Sudoku_Solver.md": None,
        "Hamiltonian_Cycle.md": None,
        "Subset_Sum.md": None,
    },
    "Divide_and_Conquer": {
        "Binary_Search.md": None,
        "Merge_Sort.md": None,
        "Quick_Sort.md": None,
        "Karatsuba_Algorithm.md": None,
        "Strassen's_Matrix_Multiplication.md": None,
    },
    "Bit_Manipulation": {
        "Basic_Bit_Operations.md": None,
        "Bit_Masks.md": None,
        "Power_Set.md": None,
    },
    "Mathematical_Algorithms": {
        "Prime_Numbers.md": None,
        "Euclidean_Algorithm.md": None,
        "Fast_Exponentiation.md": None,
        "Matrix_Exponentiation.md": None,
        "Catalan_Number.md": None,
    },
    "Computational_Geometry": {
        "Convex_Hull.md": None,
        "Line_Intersection.md": None,
        "Point_in_Polygon.md": None,
        "Closest_Pair_of_Points.md": None,
    },
    "Functional_Programming": {
        "Immutability.md": None,
        "Higher_Order_Functions.md": None,
        "Recursion_Techniques.md": None,
        "Functools.md": None,
        "Itertools.md": None,
    },
    "Python_Internals": {
        "Memory_Management.md": None,
        "GIL_(Global_Interpreter_Lock).md": None,
        "Bytecode_Operations.md": None,
    },
},
"Standard_Library_Deep_Dive": {
    "Collections_Module": {
        "DefaultDict.md": None,
        "Counter.md": None,
        "Deque.md": None,
    },
    "Itertools_Module": {
        "Combinations.md": None,
        "Permutations.md": None,
        "Product.md": None,
    },
    "Functools_Module": {
        "Partial.md": None,
        "LRU_Cache.md": None,
    },
    "Typing_Module": {
        "Type_Hints.md": None,
        "Generic_Types.md": None,
    },
    "Concurrent_Module": {
        "Futures.md": None,
        "Executors.md": None,
    },
},
"Python_2_to_3_Migration": {
    "Print_Function.md": None,
    "Division_Operator.md": None,
    "Unicode_Strings.md": None,
},
"Best_Practices_and_Code_Style": {
    "PEP8_Guidelines.md": None,
    "Code_Documentation": {
        "Docstrings.md": None,
        "Type_Annotations.md": None,
    },
    "Code_Organization": {
        "Project_Structure.md": None,
        "Module_Design.md": None,
    },
},
}

# Define the base path where the structure will be created
base_path = r"C:\Users\admin\Desktop\python-query-vault\new_files"

# Function to create the directory and file structure
def create_structure(base, structure):
    for name, content in structure.items():
        path = os.path.join(base, name)
        if content is None:
            # Create the file if it's None
            with open(path, "w") as f:
                pass
        else:
            # Create the directory and recurse
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)

# Create the base directory
os.makedirs(base_path, exist_ok=True)

# Create the structure
create_structure(base_path, structure)

print(f"Directory and file structure created at {base_path}")
