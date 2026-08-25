# Working with String Character Methods - What Is ASCII, and How Does It Work with charCodeAt() and fromCharCode()? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-string-character-methods/what-is-ascii-and-how-does-it-work-with-charcodeat-and-fromcharcode · Saved 8/25/2026, 5:07:09 PM

## Original Content

#### What Is ASCII, and How Does It Work with charCodeAt() and fromCharCode()?

In programming, understanding how characters are represented as numbers is fundamental. This is where ASCII comes in. ASCII, short for American Standard Code for Information Interchange, is a character encoding standard used in computers to represent text. It assigns a numeric value to each character, which is universally recognized by machines.

In this lesson, we will explore what ASCII is, how it works, and how JavaScript methods like charCodeAt() and fromCharCode() relate to character encoding. While JavaScript strings use Unicode (UTF-16) internally, ASCII values match the first 128 Unicode characters, which is why ASCII-based examples work in JavaScript.

ASCII is a system for encoding characters such as letters, digits, and symbols into numerical values. Each character is mapped to a specific number.

For example, the capital letter A is represented by the number 65 in ASCII, while the lowercase a is represented by
97. This encoding allows computers to store and manipulate text.

The ASCII standard covers 128 characters including:
- Uppercase and lowercase English letters (A-Z, a-z).
- Numbers (0-9).
- Common punctuation marks and symbols (!, @, #, and so on).
- Control characters (such as newline and tab).

In JavaScript, you can access the numeric code of a character using the charCodeAt() method. This method returns the UTF-16 code unit of the character at a specified index. For the first 128 characters, this value matches the ASCII code.

Let’s take a look at an example:

let letter = "A"; console.log(letter.charCodeAt(0)); // 65

In this example, A is the first character of the string, and calling charCodeAt(0) returns its numeric code (which matches its ASCII value for basic Latin characters), 65.

You can also use this method with other characters to find their numeric code values:

let symbol = "!"; console.log(symbol.charCodeAt(0)); // 33

Here, the numeric code for the exclamation mark ! is returned as 33 (which matches its ASCII value).

While charCodeAt() helps you retrieve the numeric code of a character, the fromCharCode() method allows you to do the opposite: convert a UTF-16 code unit (which matches ASCII for basic characters) into its corresponding character.

Let's see this in action:

let char = String.fromCharCode(65); console.log(char); // A

In this example, fromCharCode(65) converts the numeric code 65 (which matches the ASCII value for
A) back to the character A.

Another example would be converting the number 97 to its corresponding lowercase letter:

let char = String.fromCharCode(97); console.log(char); // a

These methods are particularly useful when you need to manipulate or compare characters based on their numeric code values.

For instance, you might use charCodeAt() to check if a character is uppercase, lowercase, or a digit by comparing its ASCII value.

On the other hand, fromCharCode() can be used to dynamically generate characters from their ASCII codes.

##### Questions

What does the charCodeAt() method return when used on a string in JavaScript?

What will the following code output?

console.log(String.fromCharCode(66));

Which of the following is an example of how character encoding is useful in programming?

### 📝 MCQs on this page

**Q1. What does the charCodeAt() method return when used on a string in JavaScript?**

- **A.** The number of characters in the string.
- **B.** The index of a character in the string.
- **C.** The UTF-16 code unit of a character at a specified index.
- **D.** The hexadecimal representation of a character.

**Q2. What will the following code output? console.log(String.fromCharCode(66));**

- **A.** B
- **B.** b
- **C.** 6
- **D.** A

**Q3. Which of the following is an example of how character encoding is useful in programming?**

- **A.** To check whether a value is null or undefined.
- **B.** To calculate the length of a string.
- **C.** To convert a number into a floating-point value.
- **D.** To manipulate characters based on their numerical values.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- ASCII is a character encoding standard that assigns a number to each character.
- It covers 128 characters, including letters, numbers, symbols, and control characters.
- Examples: `A` is `65`, `a` is `97`, `!` is `33`.
- JavaScript strings use Unicode internally, but the first 128 Unicode values match ASCII.
- `charCodeAt(index)` returns the numeric code of the character at a given index.
- `String.fromCharCode(number)` converts a numeric code back into a character.
- These methods are useful for comparing, checking, or generating characters based on their numeric values.

## What the MCQs are asking
- The first question asks what `charCodeAt()` returns: the numeric code of a character in a string.
- The second question asks what `String.fromCharCode(66)` outputs: the character `B`.
- The third question asks for an example of why character encoding is useful: it lets programmers work with characters using numbers, such as checking if a character is uppercase, lowercase, or a digit.

## What it means
- Computers store text as numbers, not as visual letters.
- `charCodeAt()` converts a character into its numeric code.
- `fromCharCode()` converts a numeric code into a character.
- Knowing character codes helps you manipulate strings and understand how text is represented in memory.
- ASCII examples work in JavaScript because ASCII is a subset of Unicode.

## Most important things to know
- ASCII stands for American Standard Code for Information Interchange.
- `A` is `65`, `a` is `97`, and `!` is `33`.
- `charCodeAt(0)` gets the code for the first character in a string.
- `String.fromCharCode(65)` returns `"A"`.
- `String.fromCharCode(66)` returns `"B"`.
- Character encoding is useful for tasks like checking character types, comparing characters, and generating characters from numbers.
