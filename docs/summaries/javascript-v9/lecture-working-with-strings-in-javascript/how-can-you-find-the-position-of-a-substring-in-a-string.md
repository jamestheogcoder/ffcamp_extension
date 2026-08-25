# Working with Strings in JavaScript - How Can You Find the Position of a Substring in a String? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-strings-in-javascript/how-can-you-find-the-position-of-a-substring-in-a-string · Saved 8/25/2026, 3:49:44 PM

## Original Content

#### How Can You Find the Position of a Substring in a String?

When working with strings in JavaScript, there may be times when you need to locate the position of a specific substring within a larger string.

A substring is a sequence of characters that appears within a larger string. For example, in the string hello world, hello and world are substrings.

To locate the position of a substring inside of a string, you can use the indexOf() method. The indexOf() method in JavaScript allows you to search for a substring within a string.

If the substring is found, indexOf() returns the index (or position) of the first occurrence of that substring. If the substring is not found, indexOf() returns -1, which indicates that the search was unsuccessful.

The indexOf() method takes two arguments: the first is the substring you want to find within the larger string, and the second is an option starting position for the search. If you don’t provide a starting position, the search will begin at the start of the string.

In this context, an argument is a value you give to a function or method when you call it, enabling that function or method to perform its task using the specific information you provide. You will learn more about arguments in future lessons.

Here is an example of using the indexOf() method to find the position for the string awesome:

let sentence = "JavaScript is awesome!"; let position = sentence.indexOf("awesome!"); console.log(position); // 14

In this example, the word awesome starts at index 14 in the string JavaScript is awesome!, so the indexOf() method returns 14.

Now, let's see what happens when the substring isn't found:

let sentence = "JavaScript is awesome!"; let position = sentence.indexOf("fantastic"); console.log(position); // -1

Since the word fantastic does not appear in the string, the method returns -1.

You can also specify where to begin searching within the string by providing a second argument to indexOf(). Here's an example:

let sentence = "JavaScript is awesome, and JavaScript is powerful!"; let position = sentence.indexOf("JavaScript", 10); console.log(position); // 27

In this case, the search for JavaScript begins after the 10th character, and so the second occurrence of JavaScript is found at index 27.

It is important to note that the indexOf() method is case sensitive.

In this example, the following would return -1 because the capital letter F is not found in the string freeCodeCamp.

console.log("freeCodeCamp".indexOf("F")) // -1

Using indexOf() can be very useful when you need to check if a substring is present in a string and to determine its position for further operations.

##### Questions

What does the indexOf method return if the substring is not found in the string?

How can you use indexOf to search for a substring starting at a specific position within the string?

What will indexOf() return in this example?

const str = "I am learning JavaScript."; str.indexOf("Javascript");

### 📝 MCQs on this page

**Q1. What does the indexOf method return if the substring is not found in the string?**

- **A.** 0
- **B.** The length of the string.
- **C.** -1
- **D.** The position of the first character.

**Q2. How can you use indexOf to search for a substring starting at a specific position within the string?**

- **A.** By using the first argument to specify the starting position.
- **B.** By using the second argument to specify the starting position.
- **C.** By using an additional method.
- **D.** By changing the string first.

**Q3. What will indexOf() return in this example? const str = "I am learning JavaScript."; str.indexOf("Javascript");**

- **A.** 14
- **B.** 2
- **C.** -1
- **D.** 13


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- A substring is a smaller sequence of characters inside a larger string.
- JavaScript’s `indexOf()` method finds the position of a substring inside a string.
- It returns the index of the first match, or `-1` if the substring is not found.
- It accepts an optional second argument: the index where the search should start.
- It is case-sensitive, so `"F"` and `"f"` are treated as different characters.

## What the MCQs are asking
- First question: what value does `indexOf()` return when the substring is absent?
- Second question: how do you tell `indexOf()` to begin searching at a specific position?
- Third question: what does `str.indexOf("Javascript")` return for `str = "I am learning JavaScript."`?
- Together, they test whether you understand the return value, the optional start position, and case sensitivity.

## What it means
- If a substring is missing, `indexOf()` does not throw an error; it returns `-1`.
- To start searching later in the string, use `string.indexOf(substring, startIndex)`.
- In the example, `"Javascript"` does not match `"JavaScript"` because the capitalization is different, so the result is `-1`.
- These questions check practical string searching: locating text, checking existence, and avoiding case mistakes.

## Most important things to know
- `indexOf()` returns the first matching index, not all matches.
- `-1` means “not found.”
- The second argument is optional and sets the search start position.
- Matching is case-sensitive.
- Example: `"JavaScript is awesome!".indexOf("awesome!")` returns `14`.
