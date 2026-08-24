# Introduction to JavaScript - What Are Variables, and What Are Guidelines for Naming JavaScript Variables? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-javascript/what-are-variables · Saved 8/24/2026, 5:04:01 PM

## Original Content

#### What Are Variables, and What Are Guidelines for Naming JavaScript Variables?

In JavaScript, variables act as containers for storing data that you can access and modify throughout your program.

You can think of variables as boxes that hold values. With variables, you can keep track of things like numbers or text and refer to these values whenever you need them in your program.

One way to declare a variable in JavaScript is to use the let keyword. You will learn more about the let keyword as well as other ways to declare variables in future lessons.

Here's an example of using let to declare a variable called age:

let age;

Right now, the age variable does not have a value assigned to it. If you try to use it, it will return undefined, which means it has no value.

Here is an example.

NOTE: console.log() is a function that outputs information to the console, which is a part of your web browser used for debugging code. You will learn more about console.log() in future lessons. Also, the // symbols are used to add comments in your code. Comments are notes for yourself or other programmers that are ignored when the code runs.

let age; console.log(age); // undefined

To assign a value to a variable you will need to use the assignment operator like this:

let age = 25;

Now when you use the age variable, it will return the value of 25.

let age = 25; console.log(age); // 25

The assignment operator looks like an equals sign (=) but it doesn't check for equality. You'll learn about the correct operators for checking equality in future lessons.

The assignment operator is used to assign a value to a variable. This process of assigning a value to a variable is known as initialization.

One advantage of using the let keyword to declare variables is that you can reassign values to them. In programming, reassignment means giving a new value to a variable that already has one.

Here is an example of reassigning the value for the age variable.

let age = 25; console.log(age); // 25 age = 30; console.log(age); // 30

Now the age variable holds the value of
30. Notice that the let keyword wasn't needed again because the age variable was already declared, so there's no need to declare it a second time.

When using reassignment, you only need to reference the variable name. Reassignment is useful because it allows you to update and change the value stored in a variable as your program runs. A good example of this would be updating points in a game.

Naming variables may seem straightforward, but there are some rules and best practices to ensure your code is readable and functional.

Your variable names should describe what the data represents. For example, instead of using a name like x, a more descriptive name such as age or points makes your code easier to understand.

// Bad variable names let x = 10; let y = "John"; // Good variable names let age = 10;

Variables in JavaScript must begin with a letter, an underscore (_), or a dollar sign ($). They cannot start with a number.

// Valid variable names let age; let _score; let $total; // Invalid variable names let 1stPlace; // starts with a number

Variable names are case-sensitive, meaning the word age in all lowercase and the word Age with a capital A are considered different variables.

let age = 25; let Age = 30; console.log(age); // 25 console.log(Age); // 30

This is why it's important to stick with a consistent naming convention like camelCase. camelCase is where the first word is all lowercase and each subsequent word starts with an uppercase letter.

Here is an example of using the camelCase naming convention for a variable:

let thisIsCamelCase; let anotherExampleVariable; let freeCodeCampStudents;

There are certain keywords in JavaScript that you cannot use as variable names, such as let, const, function, or return, as they are reserved for the language itself.

You should also avoid using special characters like exclamation points (!) or at (@) symbols, in your variable names. It is best to keep variable names readable by using letters, numbers, underscores, or dollar signs.

By following these guidelines, your code will be cleaner and more manageable as it grows in complexity.

##### Questions

Which keyword would you use to declare a variable in JavaScript when you plan to update its value later?

Which of the following is a valid variable name in JavaScript?

Why is it important to use descriptive names for your variables?

### 📝 MCQs on this page

**Q1. Which keyword would you use to declare a variable in JavaScript when you plan to update its value later?**

- **A.** set
- **B.** let
- **C.** declare
- **D.** variable

**Q2. Which of the following is a valid variable name in JavaScript?**

- **A.** 1stPlace
- **B.** total-score!
- **C.** player1Score
- **D.** const

**Q3. Why is it important to use descriptive names for your variables?**

- **A.** It's required by JavaScript.
- **B.** Descriptive names make your code easier to understand and maintain.
- **C.** Descriptive names make the code run faster.
- **D.** Descriptive names allow you to avoid using let.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
JavaScript variables are containers for storing data that can be accessed and modified throughout a program. The article covers how to declare variables using `let`, the difference between assignment (`=`) and comparison operators, the ability to reassign values (mutation), and comprehensive guidelines for naming variables including camelCase convention, case sensitivity, and restrictions on reserved keywords and special characters.

## What the MCQs are asking
1. Which keyword would you use to declare a variable in JavaScript when you plan to update its value later?
2. Which of the following is a valid variable name in JavaScript?
3. Why is it important to use descriptive names for your variables?

## What it means
The content introduces core JavaScript concepts around variable management. It explains that variables serve as storage locations for values, emphasizing the distinction between declaring (`let`) and initializing/assigning values. The key takeaway is that `let` is preferred when you anticipate changing a variable's value later, while `const` (not shown here but implied by contrast) would be used for immutable bindings. Variable naming follows strict rules: names must start with a letter, underscore, or dollar sign; they must be descriptive; and they cannot reuse reserved keywords like `let`, `const`, `function`, or `return`. Following these conventions improves code readability and maintainability.

## Most important things to know
- Use `let` when you need to reassign a variable's value later (it supports mutation)
- Variable names should be descriptive (e.g., `age` instead of `x`)
- Follow camelCase convention: first word lowercase, subsequent words capitalized (e.g., `thisIsCamelCase`)
- Variable names are case-sensitive (`age` ≠ `Age`)
- Avoid starting variable names with numbers (e.g., `1stPlace` is invalid)
- Do not use reserved keywords as variable names (e.g., `let`, `const`, `function`, `return`)
- Keep names readable by using letters, numbers, underscores, or dollar signs only
