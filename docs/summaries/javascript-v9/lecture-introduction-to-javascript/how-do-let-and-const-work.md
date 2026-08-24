# Introduction to JavaScript - How Do let and const Work Differently When It Comes to Variable Declaration, Assignment, and Reassignment? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-javascript/how-do-let-and-const-work · Saved 8/24/2026, 5:04:13 PM

## Original Content

#### How Do let and const Work Differently When It Comes to Variable Declaration, Assignment, and Reassignment?

When working with JavaScript, you'll often declare variables to store data that you plan to use throughout your program.

In modern JavaScript, let and const are the preferred ways to declare variables, but they differ in how they handle value assignment and reassignment.

In this lesson, we'll explore how let and const differ in variable declaration, assignment, and reassignment.

The let keyword allows you to declare variables that can be updated or reassigned later. You can think of let as a flexible container: once you've stored a value in it, you can change that value as needed throughout your program.

Here's an example of declaring and assigning a variable with let:

let score = 10;

In this case, the variable score is declared and assigned the value
10. If you want to update the value later, you can easily do that:

let score = 10; console.log(score); // 10 score = 20; console.log(score); // 20

Now, score holds the value
20. This makes let particularly useful when you know the value of a variable will change as your program runs.

On the other hand, const is used to declare variables that are constant. Once you assign a value to a variable declared with const, you cannot reassign it.

This makes const ideal for values that you don't want to change accidentally during the execution of your program.

Here's an example of declaring and assigning a variable with const:

const maxScore = 100; console.log(maxScore); // 100

Once maxScore is assigned the value 100, it cannot be changed:

maxScore = 200; // This will result in an error

Trying to reassign a value to a const variable will throw an error in your JavaScript console, as const variables are immutable once they are assigned.

You can declare a let variable without immediately assigning it a value, and you can assign it a value later:

let age; console.log(age); // undefined age = 25; console.log(age); // 25

While a variable declared with let can be reassigned, it cannot be redeclared. If you try to declare the same variable again using let, you will get an error:

let age = 25; let age = 90; // SyntaxError: Identifier 'age' has already been declared

The same applies to const: a variable declared with const cannot be redeclared either.

Variables declared with const must be assigned a value at the time of declaration. If you try to declare a const variable without assigning it a value, you will get an error:

const age; // Error: Missing initializer in const declaration

You should use let when you need to declare variables that will be reassigned later. For example, tracking a changing score or updating a value over time in your program.

Use const when you want to declare variables that should remain constant, like configuration values or settings that shouldn't be changed accidentally.

You can also use the var keyword, but it's not as recommended anymore. The var keyword is kind of like let, except it has a wider scope, which is more likely to cause problems in your program.

##### Questions

What happens if you try to reassign a value to a variable declared with const?

Which of the following is the correct way to assign the number 100 to a constant named maxScore?

const maxScore === 100;

const maxScore = 100;

const maxScore <= 100;

const maxScore == 100;

Can you declare a const variable without assigning it a value?

### 📝 MCQs on this page

**Q1. What happens if you try to reassign a value to a variable declared with const?**

- **A.** The value will change without issue.
- **B.** The original value will be updated, but a warning will be issued.
- **C.** An error will be thrown because const variables cannot be reassigned.
- **D.** The new value will be ignored, and the original value will stay the same.

**Q2. Which of the following is the correct way to assign the number 100 to a constant named maxScore?**

- **A.** const maxScore === 100;
- **B.** const maxScore = 100;
- **C.** const maxScore <= 100;
- **D.** const maxScore == 100;

**Q3. Can you declare a const variable without assigning it a value?**

- **A.** Yes, but you must assign a value later.
- **B.** No, const variables must be initialized at the time of declaration.
- **C.** Yes, but you can only assign a number as the initial value.
- **D.** No, const variables must be declared and reassigned in the same line.


<!--FFCAMP-SPLIT-->

## What the topic is explaining

JavaScript uses `let` and `const` as modern alternatives to `var` for variable declaration. The key difference lies in their behavior regarding reassignment: `let` allows variables to be updated later, while `const` creates true constants that cannot be reassigned after initial assignment. Both keywords require a value to be specified at the time of declaration (you cannot declare a `const` without an initializer). Additionally, `let` permits redeclaration within the same scope, whereas `const` does not allow redeclaration.

## What the MCQs are asking

1. **Reassigning a const variable**: What happens when you attempt to reassign a value to a `const`-declared variable?
2. **Correct const assignment syntax**: Which option correctly assigns the number 100 to a constant named `maxScore`?
3. **Const initialization requirement**: Can you declare a `const` variable without providing an initial value?

## What it means

These distinctions are crucial for writing reliable JavaScript code. Using `const` signals to other developers (and yourself) that a variable's value should remain unchanged, helping prevent accidental mutations. `let` is appropriate for values that evolve during program execution, such as counters or accumulating totals. The strictness around `const` helps catch bugs early—trying to reassign a constant results in a runtime error, which would otherwise silently propagate incorrect values through your code. Remember that `const` only prevents reassignment, not mutation of objects or arrays contained within it.

## Most important things to know

- **`const` creates immutable bindings**: Once a `const` variable is initialized, its reference cannot be reassigned to point to a different value.
- **`let` supports reassignment**: Variables declared with `let` can have their values changed throughout the program's lifetime.
- **Both require initial values**: Unlike `var`, `let` and `const` must be assigned a value at declaration; omitting an initializer throws an error.
- **Redeclaration rules**: `let` allows redeclaration within the same scope (which is allowed), but `const` does not permit redeclaration.
- **Prefer `const` for stable values**: Use `const` for configuration, constants, and values that should never change. Use `let` for mutable state like loop counters or accumulated scores.
