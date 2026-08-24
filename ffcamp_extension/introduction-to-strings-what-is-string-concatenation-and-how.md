# Introduction to Strings - What Is String Concatenation, and How Can You Concatenate Strings with Variables? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-strings/what-is-string-concatenation · Saved 8/24/2026, 2:32:29 PM

## Original Content

```text
# What Is String Concatenation, and How Can You Concatenate Strings with Variables?

In JavaScript, working with text is an essential part of coding, and often, you'll need to combine or join pieces of text together. This process is called string concatenation.

In this lesson, we'll focus on how string concatenation works, specifically using the + operator, the += operator, and the concat() method.

The + operator is one of the simplest and most frequently used methods to concatenate strings. It allows you to join multiple strings or combine strings with variables that hold text.

Here's an example:

let firstName = "John"; let lastName = "Doe"; let fullName = firstName + " " + lastName; console.log(fullName); // John Doe

In this example, we used the + operator to concatenate the firstName and lastName variables along with a space (" ") to create the full name.

One disadvantage of using the + operator for string concatenation is that it can lead to spacing issues if you don't carefully manage the spacing between the concatenated strings.

Here is an example where a space is missing:

let firstName = "John"; let lastName = "Doe"; let fullName = firstName + lastName; console.log(fullName); // JohnDoe

Whenever you use the + operator to concatenate strings, it is important to double-check for any potential spacing issues.

If you need to add or append to an existing string, then you can use the += operator. This is helpful when you want to build upon a string by adding more text to it over time.

Here's an example of appending one string to another using the += operator:

let greeting = 'Hello'; greeting += ', John!'; console.log(greeting); // Hello, John!

It is important to remember that strings are immutable, which means that once a string is created, you cannot alter it.

In this case, the original string of Hello is not modified. Instead, greeting now references the new string of Hello, John!.

Another way you can concatenate strings is to use the concat() method.

Before we begin learning about the concat() method, it is important to first understand what a method and a function are at a higher level.

In programming, a function is a reusable block of code that performs a specific task and can be called with various inputs. A method, on the other hand, is a type of function that is associated with an object, meaning it operates on the data contained within that object.

In future lessons, we will dive much deeper into how functions, objects, and methods work in JavaScript. But for now, it is important to understand that JavaScript has dozens of methods you can use, like the concat() method.

Here's an example of using the concat() method to join two strings together:

let str1 = 'Hello'; let str2 = 'World'; let result = str1.concat(' ', str2); console.log(result); // Hello World

In this example, we use the concat() method to join str1, a space (' '), and str2 into a single string.

To conclude, the + operator is best for simple concatenation, especially when you need to combine a few strings or variables.

The += operator is useful when building up a string step by step or appending new content to an existing string variable.

Finally, the concat() method is beneficial when you need to concatenate multiple strings together.

## Questions

What is the primary use of the + operator in string concatenation?

Which of the following is the correct way to concatenate strings?

let greeting = "Hi"; greeting -= " there!";

let greeting = "Hi"; greeting =+ " there!";

let greeting = "Hi"; greeting += " there!";

let greeting = "Hi"; greeting == " there!";

Which of the following is the correct method to concatenate multiple strings?
```

### MCQs
1. What is the primary use of the + operator in string concatenation?
A) To compare two strings.
B) To join two or more strings together.
C) To check if two strings are equal.
D) To remove characters from a string.

2. Which of the following is the correct way to concatenate strings?
A) let greeting = "Hi"; greeting -= " there!";
B) let greeting = "Hi"; greeting =+ " there!";
C) let greeting = "Hi"; greeting += " there!";
D) let greeting = "Hi"; greeting == " there!";

3. Which of the following is the correct method to concatenate multiple strings?
A) concatenate()
B) concat()
C) concatenating()
D) concats()

---

## What the topic is explaining
This topic covers string concatenation in JavaScript, focusing on three primary methods: the `+` operator, the `+=` operator, and the `concat()` method. It demonstrates how to combine strings with variables, highlights the importance of managing spacing when using the `+` operator, and explains why strings are immutable (they cannot be altered after creation).

## What the MCQs are asking
1. **Question 1:** What is the primary use of the `+` operator in string concatenation?
2. **Question 2:** Which of the following is the correct way to concatenate strings? (Options include `greeting -= " there!"`, `greeting =+ " there!"`, `greeting += " there!"`, and `greeting == " there!"`)

## What it means
String concatenation is the process of combining two or more strings into a single string. The `+` operator is straightforward and commonly used to join strings, though it requires careful attention to spacing. The `+=` operator modifies an existing string by appending additional text, while the `concat()` method provides a functional alternative for joining multiple strings. All three approaches produce the same result, but they differ in syntax and use cases—`+` is simple for basic combinations, `+=` is ideal for incremental building, and `concat()` is useful when chaining multiple strings together.

## Most important things to know
- The `+` operator is the most common way to concatenate strings but can introduce unwanted spaces if not managed properly (e.g., `firstName + lastName` produces `"JohnDoe"` instead of `"John Doe"`).
- The `+=` operator appends text to an existing string, making it efficient for building strings step-by-step without reassigning the variable repeatedly.
- The `concat()` method is a functional approach that returns a new string without modifying the originals, which aligns well with immutability principles in JavaScript.
- Strings are immutable, meaning operations like concatenation create new string instances rather than modifying the originals.
