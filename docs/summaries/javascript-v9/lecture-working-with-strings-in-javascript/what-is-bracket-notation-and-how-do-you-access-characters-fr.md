# Working with Strings in JavaScript - What Is Bracket Notation, and How Do You Access Characters from a String? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-strings-in-javascript/what-is-bracket-notation-and-how-do-you-access-characters-from-a-string · Saved 8/25/2026, 3:45:55 PM

## Original Content

#### What Is Bracket Notation, and How Do You Access Characters from a String?

In JavaScript, strings are treated as sequences of characters, and each character in a string can be accessed using bracket notation. This allows you to retrieve a specific character from a string based on its position, which is called its index.

An index is the position of a character within a string, and it is zero-based. This means that the first character of a string has an index of 0, the second character has an index of 1, and so on.

For example, in the string hello, the character h is at index 0, e is at index 1, l is at index 2, and so on.

Bracket notation uses square brackets ([]) and the index of the character you want to access. Let’s look at an example:

let greeting = "hello"; console.log(greeting[1]); // "e"

In this example, we can access the character at index 1, which is e.

To get the last character of a string, you can use the length of the string minus one. The length property of a string tells you how many characters it contains, so to access the last character, you would subtract one from the length:

let greeting = "hello"; console.log(greeting[greeting.length - 1]); // "o"

In this case, the length of hello is 5, and the last character (o) is at index 4 which is 5 - 1.

If you want to get multiple characters, you can use bracket notation like this:

let greeting = "hello"; let firstTwo = greeting[0] + greeting[1]; // "he" console.log(firstTwo);

In this example, we are concatenating the first and second characters using bracket notation to form the string he.

Bracket notation is useful when you need to access specific characters in a string, such as extracting initials from a name or checking a specific letter for validation.

##### Questions

What is the index of the character "r" in the string "JavaScript"?

How would you access the last character of a string using bracket notation?

What does bracket notation allow you to do with strings in JavaScript?

### 📝 MCQs on this page

**Q1. What is the index of the character "r" in the string "JavaScript"?**

- **A.** 2
- **B.** 4
- **C.** 6
- **D.** 8

**Q2. How would you access the last character of a string using bracket notation?**

- **A.** string[length]
- **B.** string[string.length]
- **C.** string[string.length - 1]
- **D.** string[string - 1]

**Q3. What does bracket notation allow you to do with strings in JavaScript?**

- **A.** Add new characters to the string.
- **B.** Change the data type of the string.
- **C.** Access specific characters in the string using their index.
- **D.** Convert the string into an array of characters.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- JavaScript strings are sequences of characters.
- Each character has a position called an index.
- Indexing is zero-based: the first character is at index `0`.
- Bracket notation uses `[]` to access a character by its index.
- The `length` property gives the number of characters in a string.
- The last character is at index `string.length - 1`.
- You can combine characters using `+` to build new strings.

## What the MCQs are asking
- The first question asks for the index of `"r"` in `"JavaScript"`.
  - Answer: `6`.
- The second question asks how to access the last character of a string.
  - Answer: `string[string.length - 1]`.
- The third question asks what bracket notation allows you to do.
  - Answer: It lets you access specific characters in a string by their index.

## What it means
- A string like `"hello"` can be thought of as a list of characters:
  - `h` is at index `0`
  - `e` is at index `1`
  - `l` is at index `2`
  - `l` is at index `3`
  - `o` is at index `4`
- `greeting[1]` means “give me the character at position 1.”
- `greeting[greeting.length - 1]` means “give me the character one position before the end.”
- This is useful when you need to inspect or extract specific letters from a string.

## Most important things to know
- String indexes start at `0`, not `1`.
- Use bracket notation: `string[index]`.
- Use `string.length` to find the string size.
- The last character is always at `string.length - 1`.
- Bracket notation is for reading characters, not changing the string directly.
