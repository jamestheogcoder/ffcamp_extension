# Introduction to Strings - What Is console.log Used For, and How Does It Work? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-strings/what-is-console-log · Saved 8/24/2026, 5:13:00 PM

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

### 📝 MCQs on this page

**Q1. What does the console.log() method do in JavaScript?**

- **A.** It audits your code for errors and displays the results in the browser console.
- **B.** It is used to log data and display the output in the browser console.
- **C.** It stores values in a database as well as the browser console.
- **D.** It changes the HTML content on the page and shows the changes in the browser console.

**Q2. What will be logged to the console? const age = 10; console.log(age);**

- **A.** 10
- **B.** "10"
- **C.** age
- **D.** "age"

**Q3. Why is console.log() helpful when building out web applications?**

- **A.** It is commonly used to check the performance of an application and see the results in the console.
- **B.** It is commonly used by developers for debugging and inspecting values or expressions in their code during development.
- **C.** It is commonly used to check for linting errors in your code and display those errors in the console.
- **D.** It is commonly used to ensure that your JavaScript code is adhering to best practices.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- `console.log()` outputs messages or values to the browser's console for developers
- Used mainly for debugging and inspecting code while programs run
- Called with a value or message inside parentheses: `console.log("Hello, world!")`
- Can log variables directly, e.g., `console.log(num)` prints the variable's current value
- Can build strings with concatenation: `"Hello, " + name + "!"` → `Hello, Alice!`
- Can pass multiple values separated by commas to log several pieces at once
- Helps monitor code execution and spot mistakes

## What the MCQs are asking
- What is the purpose of `console.log()` in JavaScript
- What output results from `const age = 10; console.log(age);`
- Why is `console.log()` useful when building web applications

## What it means
- `console.log()` is a developer tool to display information in the console, not to the page
- Logging `age` means the console will show the current value of the variable, here `10`
- Helpfulness comes from real-time visibility into program state, making bugs easier to find and logic easier to understand

## Most important things to know
- `console.log()` writes to the browser console, not to the DOM
- It can log text, variables, and multiple arguments in one call
- It is for debugging/inspection; it does not change program behavior
- Seeing actual runtime values is key to verifying code runs correctly
