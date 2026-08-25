# Working with Data Types - What Is Dynamic Typing in JavaScript, and How Does It Differ from Statically Typed Languages? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-data-types/what-is-dynamic-typing-in-javascript-and-how-does-it-differ-from-statically-typed-languages · Saved 8/25/2026, 3:41:28 PM

## Original Content

#### What Is Dynamic Typing in JavaScript, and How Does It Differ from Statically Typed Languages?

JavaScript is a dynamically typed language, meaning you don't need to specify the data type of a variable when you declare it. Instead, the type is determined based on the value assigned to the variable while the program is running. This allows you to change the type of a variable throughout the program.

Let's look at an example:

let example = "Hello"; example = 42;

In this example, we have a variable called example with the data type of string. But then we update value to be a number instead.

The flexibility of dynamic typing makes JavaScript more forgiving and easy to work with for quick scripting, but it can also introduce bugs that may be harder to catch, especially as your program grows larger.

In statically typed languages like C# or C++, you must declare the data type of a variable when you create it, and that type cannot change.

For instance, if you declare a variable as integer, you can only assign it integer values. If you try to assign it a different type, the program will throw an error.

Here's an example in C# language:

int data = 42; // data must always be an integer data = "Hello"; // This would cause an error in C#

The difference between dynamic typing and static typing lies in the flexibility vs. the safety of your code. Dynamically typed languages offer flexibility but at the cost of potential runtime errors.

Statically typed languages enforce stricter rules that can prevent certain errors, but they require more upfront declaration and offer less flexibility in changing types.

Here is another example of creating a variable with a type set to number then changing it to later be of type string:

let data = 100; // Initially a number data = "New data"; // Dynamically changes to a string

In a statically typed language, this kind of change would not be allowed, as the data type would be fixed.

In conclusion, JavaScript's dynamic typing allows variables to change types freely, which offers flexibility but can lead to unexpected errors during execution.

Statically typed languages like Java require you to specify variable types upfront, which helps catch errors before the program runs but offers less flexibility.

##### Questions

Which of the following best describes dynamic typing in JavaScript?

What is a key difference between dynamically typed languages and statically typed languages?

In JavaScript, what happens if you declare a variable and later assign it a value of a different type?

### 📝 MCQs on this page

**Q1. Which of the following best describes dynamic typing in JavaScript?**

- **A.** You must declare the type of the variable before assigning a value.
- **B.** The data type of a variable is determined when it is assigned a value.
- **C.** Variables can only hold one type of data.
- **D.** JavaScript does not allow changing variable types after they are declared.

**Q2. What is a key difference between dynamically typed languages and statically typed languages?**

- **A.** Dynamically typed languages require you to declare variable types before assigning values.
- **B.** Statically typed languages allow changing variable types at runtime.
- **C.** Statically typed languages enforce a fixed variable type.
- **D.** Dynamically typed languages do not allow variable reassignment.

**Q3. In JavaScript, what happens if you declare a variable and later assign it a value of a different type?**

- **A.** JavaScript will throw a compile-time error.
- **B.** The variable will change to the new type without error.
- **C.** The variable will retain its original type and ignore the new value.
- **D.** The program will crash.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- JavaScript is **dynamically typed**, meaning you do not declare a variable’s data type when creating it.
- The type is determined by the value assigned to the variable at runtime.
- A variable can be reassigned to a different type, such as changing from a string to a number.
- Statically typed languages, like C#, C++, or Java, require you to declare a variable’s type upfront.
- In statically typed languages, a variable’s type generally cannot change, and assigning the wrong type causes an error.
- The main tradeoff is **flexibility vs. safety**: dynamic typing is flexible but can cause runtime bugs; static typing is stricter but helps catch errors earlier.

## What the MCQs are asking
- The first question asks you to identify what **dynamic typing** means in JavaScript.
  - Correct idea: the variable’s type is based on the value assigned to it.
- The second question asks for a key difference between dynamically typed and statically typed languages.
  - Correct idea: dynamic languages allow type changes at runtime, while static languages enforce fixed types.
- The third question asks what happens in JavaScript if a variable is later assigned a value of a different type.
  - Correct idea: it is allowed, and the variable now holds the new type/value.

## What it means
- In JavaScript, this is valid:
  - `let data = 100;`
  - `data = "New data";`
- The variable `data` starts as a number and later becomes a string.
- In a statically typed language, if `data` was declared as an integer, assigning a string would cause an error.
- Dynamic typing makes JavaScript easier for quick scripting and experimentation.
- However, because types can change freely, bugs may only appear when the program runs.
- Static typing helps prevent certain mistakes before the program runs, but requires more explicit setup.

## Most important things to know
- In JavaScript, **variables do not have fixed types**; the values they hold have types.
- You can reassign a variable to a different type without declaring a new type.
- Statically typed languages require explicit type declarations and usually prevent type changes.
- Dynamic typing gives more flexibility but can lead to unexpected runtime errors.
- Static typing gives more safety and earlier error detection but less flexibility.
- For larger JavaScript projects, tools like TypeScript can add static type checking to reduce type-related bugs.
