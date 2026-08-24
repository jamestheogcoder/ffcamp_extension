# Introduction to Strings - What Is console.log Used For, and How Does It Work? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-strings/what-is-console-log · Saved 8/24/2026, 2:57:08 PM

## Original Content

#### What Is console.log Used For, and How Does It Work?

The prior lessons introduced you to console.log(), but this lesson will dive deeper into its purpose and usage.

In JavaScript, console.log() is a simple yet powerful tool used to display messages or output information to the browser's console. It's mostly used by developers to debug and inspect code while working on their programs.

You can use console.log() to log text or variables to the console and ensure your code is running correctly.

To use console.log(), you call the method with the value or message you want to output inside the parentheses. Here are some examples:

console.log("Hello, world!"); let num = 5; console.log(num); // 5

The first example prints Hello, world! in the browser's console, while the second example prints the value 5.

Here is another example of working with console.log():

let name = "Alice"; console.log("Hello, " + name + "!"); // Hello, Alice!

You can also pass in multiple values to console.log() separated by commas. For example:

let name = "Alice"; let age = 25; console.log("Name:", name, "Age:", age); // Name: Alice Age: 25

This is helpful for logging multiple pieces of information at once.

The console.log() method helps you monitor your code as it runs, making it easier to spot mistakes and understand how your program behaves.

##### Questions

What does the console.log() method do in JavaScript?

What will be logged to the console?

const age = 10; console.log(age);

Why is console.log() helpful when building out web applications?

### MCQs
1. What does the console.log() method do in JavaScript?
A) It audits your code for errors and displays the results in the browser console.
B) It is used to log data and display the output in the browser console.
C) It stores values in a database as well as the browser console.
D) It changes the HTML content on the page and shows the changes in the browser console.

2. What will be logged to the console? const age = 10; console.log(age);
A) 10
B) "10"
C) age
D) "age"

3. Why is console.log() helpful when building out web applications?
A) It is commonly used to check the performance of an application and see the results in the console.
B) It is commonly used by developers for debugging and inspecting values or expressions in their code during development.
C) It is commonly used to check for linting errors in your code and display those errors in the console.
D) It is commonly used to ensure that your JavaScript code is adhering to best practices.

<!--FFCAMP-SPLIT-->

## What the topic is explaining
- `console.log()` is a JavaScript method that outputs messages, text, or variable values to the browser's console
- It's primarily used by developers for debugging and inspecting code during development
- The method takes values inside parentheses and displays them in the browser's developer tools console
- Examples shown: logging strings directly, logging variable values, concatenating strings with variables, and logging multiple values separated by commas

## What the MCQs are asking
- **Question 1**: Asks for the general purpose/function of `console.log()` in JavaScript
- **Question 2**: Asks what specific output appears when `const age = 10; console.log(age);` runs
- **Question 3**: Asks why `console.log()` is useful when building web applications
- These questions test understanding of the basic functionality, practical output, and real-world utility of the method

## What it means
- `console.log()` serves as a window into what your code is doing at any given moment
- It helps verify that variables contain expected values and that code executes in the correct order
- When you log a variable (like `age`), you see its current value (10), not the variable name
- Multiple comma-separated arguments display with spaces between them, making it easy to log related information together
- This tool is essential for finding and fixing bugs because it lets you trace the flow of data through your program

## Most important things to know
- **Core function**: Outputs values to the browser console for debugging purposes
- **Syntax**: `console.log(value1, value2, ...)` - values separated by commas display with spaces
- **Variable logging**: `console.log(variableName)` shows the variable's current value
- **String concatenation**: Can combine text and variables using `+` operator or pass multiple arguments
- **Primary use case**: Debugging - helps developers see what's happening inside their code in real-time
