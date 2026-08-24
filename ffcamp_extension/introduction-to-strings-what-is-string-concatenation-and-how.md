# Introduction to Strings - What Is String Concatenation, and How Can You Concatenate Strings with Variables? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-strings/what-is-string-concatenation · Saved 8/24/2026, 2:28:54 PM

## Original Content

# What Is String Concatenation, and How Can You Concatenate Strings with Variables?

In JavaScript, working with text is an essential part of coding, and often, you'll need to combine or join pieces of text together. This process is called string concatenation.

In this lesson, we'll focus on how string concatenation works, specifically using the + operator, the += operator, and the concat() method.

The + operator is one of the simplest and most frequently used methods to concatenate strings. It allows you to join multiple strings or combine strings with variables that hold text.

Here's an example:

```js
let firstName = "John"; let lastName = "Doe"; let fullName = firstName + " " + lastName; console.log(fullName); // John Doe
```

In this example, we used the + operator to concatenate the firstName and lastName variables along with a space (" ") to create the full name.

One disadvantage of using the + operator for string concatenation is that it can lead to spacing issues if you don't carefully manage the spacing between the concatenated strings.

Here is an example where a space is missing:

```js
let firstName = "John"; let lastName = "Doe"; let fullName = firstName + lastName; console.log(fullName); // JohnDoe
```

Whenever you use the + operator to concatenate strings, it is important to double-check for any potential spacing issues.

If you need to add or append to an existing string, then you can use the += operator. This is helpful when you want to build upon a string by adding more text to it over time.

Here's an example of appending one string to another using the += operator:

```js
let greeting = 'Hello'; greeting += ', John!'; console.log(greeting); // Hello, John!
```

It is important to remember that strings are immutable, which means that once a string is created, you cannot alter it.

In this case, the original string of Hello is not modified. Instead, greeting now references the new string of Hello, John!.

Another way you can concatenate strings is to use the concat() method.

Before we begin learning about the concat() method, it is important to first understand what a method and a function are at a higher level.

In programming, a function is a reusable block of code that performs a specific task and can be called with various inputs. A method, on the other hand, is a type of function that is associated with an object, meaning it operates on the data contained within that object.

In future lessons, we will dive much deeper into how functions, objects, and methods work in JavaScript. But for now, it is important to understand that JavaScript has dozens of methods you can use, like the concat() method.

Here's an example of using the concat() method to join two strings together:

```js
let str1 = 'Hello'; let str2 = 'World'; let result = str1.concat(' ', str2); console.log(result); // Hello World
```

In this example, we use the concat() method to join str1, a space (' '), and str2 into a single string.

To conclude, the + operator is best for simple concatenation, especially when you need to combine a few strings or variables.

The += operator is useful when building up a string step by step or appending new content to an existing string variable.

Finally, the concat() method is beneficial when you need to concatenate multiple strings together.

## Questions

What is the primary use of the + operator in string concatenation?

Which of the following is the correct way to concatenate strings?

```js
let greeting = "Hi"; greeting -= " there!";
```

```js
let greeting = "Hi"; greeting =+ " there!";
```

```js
let greeting = "Hi"; greeting += " there!";
```

```js
let greeting = "Hi"; greeting == " there!";
```

Which of the following is the correct method to concatenate multiple strings?

### MCQs
=== MCQs ON THIS PAGE ===
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
- String concatenation joins text pieces together in JavaScript.  
- The **+** operator is the most common way to combine strings or variables.  
- The **+=** operator appends text to an existing string variable.  
- The **concat()** method can join multiple strings, including separators.  
- Strings are **immutable**; operations create new strings rather than changing the original.  
- Proper spacing must be managed when using **+** to avoid unintended results (e.g., “JohnDoe”).  

## What the MCQs are asking
- **Q1:** Asks what the primary purpose of the **+** operator is in string context.  
- **Q2:** Presents four code snippets and asks which correctly uses the concatenation operator.  
- **Q3:** Lists possible method names and asks which is the correct built‑in method for concatenating strings.  

## What it means
- **+ operator**: Directly joins two or more strings/variables; best for simple, one‑off concatenations.  
- **+= operator**: Adds to an existing variable’s value; useful for building a string incrementally.  
- **concat() method**: A string‑specific function that can combine several strings at once, often with extra arguments.  
- **Immutability**: When you “modify” a string with `+=` or `concat()`, a new string is created; the original remains unchanged.  
- **Spacing**: Remember to include spaces or punctuation explicitly when using `+` to keep the result readable.  
- The MCQs test recognition of the correct operator (`+=`) and method (`concat`) versus common mistakes (`-=`, `=+`, `==`).  

## Most important things to know
- Use **+** for straightforward concatenation of a few strings or variables.  
- Use **+=** when you need to append additional text to an existing string variable.  
- Use **concat()** when you want to join multiple strings, possibly with separators, in a single call.  
- Strings are immutable; operations always produce a new string.  
- Always check spacing when using **+** to avoid unintended merged words.  
- The correct concatenation operator is **+=**, not **-=**, **=+**, or **==**.  
- The built‑in method for concatenating strings is **concat()**, not other misspelled variants.
