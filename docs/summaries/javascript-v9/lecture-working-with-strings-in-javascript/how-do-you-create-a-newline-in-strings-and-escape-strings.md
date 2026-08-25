# Working with Strings in JavaScript - How Do You Create a Newline in Strings and Escape Strings? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-strings-in-javascript/how-do-you-create-a-newline-in-strings-and-escape-strings · Saved 8/25/2026, 3:47:05 PM

## Original Content

#### How Do You Create a Newline in Strings and Escape Strings?

When working with strings in JavaScript, there are times when you need to include special characters that the JavaScript engine might otherwise misinterpret.

Two common tasks involve creating a newline within a string and escaping certain characters (like quotes) to make sure they appear correctly.

In many programming languages, including JavaScript, you can create a newline in a string using a special character called an escape sequence. The most common escape sequence for newlines is \n.

For example, if you want to break a string into multiple lines, you would use \n where you want the new line to begin:

let poem = "Roses are red,\nViolets are blue,\nJavaScript is fun,\nAnd so are you."; console.log(poem);

The \n escape sequence tells JavaScript to insert a line break at that point, which results in the string being displayed across multiple lines.

Another important concept when working with strings is escaping characters. Sometimes, you need to include characters in your string that JavaScript normally uses for something else, such as quotes.

If you simply use quotes inside a string without escaping them, it can cause an error because JavaScript will think you're trying to end the string.

For example, this will cause an error:

let statement = "She said, "Hello!"";

JavaScript gets confused because it thinks the string ends after the word "said," but, you want the quotes around "Hello!" to be part of the string.

To fix this, you can escape the inner quotes by placing a backslash (\) before them:

let statement = "She said, \"Hello!\""; console.log(statement); // She said, "Hello!"

The backslash tells JavaScript to treat the quotes as literal characters, so they appear correctly in the output.

You can also escape other special characters, such as the backslash itself (\\), or single quotes within a string surrounded by single quotes (\').

Here's another example using single quotes:

let quote = 'It\'s a beautiful day!'; console.log(quote); // It's a beautiful day!

By escaping the single quote with \', JavaScript knows to include it as part of the string rather than ending the string early.

Escaping and creating newlines are essential when you’re formatting output or handling special characters in strings. These techniques help you prevent errors and ensure your text appears exactly as intended.

##### Questions

Which of the following escape sequences would you use to create a new line in a string?

Why is it necessary to escape certain characters within a string?

How would you correctly include single quotes within a string that is already wrapped in single quotes?

### 📝 MCQs on this page

**Q1. Which of the following escape sequences would you use to create a new line in a string?**

- **A.** \\
- **B.** \t
- **C.** \n
- **D.** \"

**Q2. Why is it necessary to escape certain characters within a string?**

- **A.** To perform mathematical operations on the string.
- **B.** To avoid syntax errors and ensure special characters are included in the string.
- **C.** To combine two different strings into one.
- **D.** To change the string to uppercase.

**Q3. How would you correctly include single quotes within a string that is already wrapped in single quotes?**

- **A.** Use single quotes inside double quotes.
- **B.** Use the \ character before the quotes you want to include.
- **C.** Use \n to break the string.
- **D.** JavaScript doesn't allow quotes inside other quotes.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- JavaScript strings can contain special characters that need special handling.
- A newline inside a string is created with the escape sequence `\n`.
- Escaping means using a backslash `\` before a character so JavaScript treats it as literal text instead of code.
- This is needed when a string contains characters like quotes that could otherwise end the string early.

## What the MCQs are asking
- Which escape sequence creates a new line?  
  - Answer idea: `\n`
- Why must certain characters be escaped?  
  - Answer idea: To prevent JavaScript from misreading them as string boundaries or syntax, which would cause errors.
- How do you include single quotes inside a single-quoted string?  
  - Answer idea: Use `\'` to escape the single quote.

## What it means
- The backslash `\` changes the meaning of the next character.
- `\n` does not mean the letters `n`; it means “insert a line break here.”
- If a string is wrapped in double quotes, inner double quotes must be escaped as `\"`.
- If a string is wrapped in single quotes, inner single quotes must be escaped as `\'`.
- To include a literal backslash, use `\\`.

## Most important things to know
- Use `\n` to create a newline in a string.
- Use `\` to escape special characters.
- Common escapes:
  - `\n` = newline
  - `\"` = double quote inside a double-quoted string
  - `\'` = single quote inside a single-quoted string
  - `\\` = literal backslash
- Escaping helps your string display exactly as intended and avoids syntax errors.
