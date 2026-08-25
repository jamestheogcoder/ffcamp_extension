# Working with Data Types - How Does the typeof Operator Work, and What Is the typeof null Bug in JavaScript? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-data-types/how-does-the-typeof-operator-work-and-what-is-the-typeof-null-bug-in-javascript · Saved 8/25/2026, 3:42:24 PM

## Original Content

#### How Does the typeof Operator Work, and What Is the typeof null Bug in JavaScript?

The typeof operator in JavaScript is a simple yet powerful tool that lets you see the data type of a variable or value. It always returns a string indicating the type.

Let's take a look at a few examples:

let num = 42; console.log(typeof num); // "number"

In this first example, we have created a variable called num and assigned it the number
42. When you use the typeof operator on the variable named num, it will return the string number.

Here is another example of using the typeof operator on variable called isUserLoggedIn:

let isUserLoggedIn = true; console.log(typeof isUserLoggedIn); // "boolean"

When you use the typeof operator on the isUserLoggedIn variable, it will return a string boolean because the boolean true was assigned to the variable.

Using the typeof operator can be especially useful when you're debugging or trying to understand what kind of data you're working with in your code.

However, there's a well-known quirk in JavaScript when it comes to null.

Let's take a look at an example:

let exampleVariable = null; console.log(typeof exampleVariable); // "object"

In this example, we have a variable called exampleVariable and have assigned it the value of null. But when we use the typeof operator, it returns the string object.

This is widely considered a bug in JavaScript, dating back to its early days. The reason for this behavior is rooted in the way JavaScript was originally designed.

When the language was first implemented, values like null were represented as a special type of object, leading to this unexpected result.

Unfortunately, this has become a part of the language, and while it's confusing, it's something you'll need to be aware of.

##### Questions

What does the typeof operator return when used on a string in JavaScript?

Why is typeof null considered a bug in JavaScript?

What does the typeof operator return when used on a number in JavaScript?

### 📝 MCQs on this page

**Q1. What does the typeof operator return when used on a string in JavaScript?**

- **A.** "string"
- **B.** "text"
- **C.** "character"
- **D.** "object"

**Q2. Why is typeof null considered a bug in JavaScript?**

- **A.** It returns "null" instead of "undefined".
- **B.** It returns "object" instead of "null".
- **C.** It doesn't work on null.
- **D.** It returns an error.

**Q3. What does the typeof operator return when used on a number in JavaScript?**

- **A.** "number"
- **B.** "integer"
- **C.** "numeric"
- **D.** "float"


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- The `typeof` operator checks the data type of a variable or value.
- It always returns a string, such as `"number"`, `"boolean"`, or `"string"`.
- It is useful for debugging and understanding what kind of data you are working with.
- There is a known JavaScript quirk: `typeof null` returns `"object"`.
- This happens because of how JavaScript was originally designed, and it is considered a historical bug.

## What the MCQs are asking
- One question asks what `typeof` returns for a string.
  - The answer is `"string"`.
- One question asks why `typeof null` is considered a bug.
  - Because `null` is not an object, but `typeof null` returns `"object"`.
- One question asks what `typeof` returns for a number.
  - The answer is `"number"`.

## What it means
- `typeof` tells you the type of a value, not the value itself.
- It can help you check whether a variable contains the kind of data you expect.
- The `null` case shows that `typeof` is not perfect.
- If you need to check for `null`, you should compare directly with `=== null` instead of relying only on `typeof`.

## Most important things to know
- `typeof` returns a string, not the actual type object.
- Examples:
  - `typeof 42` returns `"number"`
  - `typeof true` returns `"boolean"`
  - `typeof "hello"` returns `"string"`
- `typeof null` returns `"object"`, which is a well-known JavaScript bug.
- Use `typeof` for basic type checking, but use direct comparison for `null`.
