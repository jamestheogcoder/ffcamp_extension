# Working with Strings in JavaScript - What Are Template Literals, and What Is String Interpolation? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-strings-in-javascript/what-are-template-literals-and-what-is-string-interpolation · Saved 8/25/2026, 3:48:29 PM

## Original Content

#### What Are Template Literals, and What Is String Interpolation?

In JavaScript, template literals are a powerful and flexible way to work with strings. Unlike regular strings, which use single (') or double (") quotes, template literals are defined with backticks (`).

They allow for easier string manipulation, including embedding variables directly inside a string, a feature known as string interpolation.

Template literals make it easier to create strings that span multiple lines or include expressions (like variables or even JavaScript code) directly within the string.

Here's an example of a template literal:

const name = "Alice"; const greeting = `Hello, ${name}!`; console.log(greeting);

Notice the use of backticks instead of single or double quotes. The ${name} syntax is an example of string interpolation, where the value of the variable name is directly inserted into the string.

String interpolation allows you to embed variables and expressions inside a string. This is a significant improvement over the older method, where you would concatenate strings and variables using the + operator.

Here is an example using string concatenation and the plus (+) operator:

const name = "Alice"; const age = 25; const message = "My name is " + name + " and I am " + age + " years old."; console.log(message);

And here is an example using template literals and string interpolation:

const name = "Alice"; const age = 25; const message = `My name is ${name} and I am ${age} years old.`; console.log(message);

As you can see, string interpolation with template literals is much cleaner and easier to read, especially when you're working with multiple variables.

Another great feature of template literals is that they support multiline strings. With regular strings, you would need to use escape characters (\n) to create new lines. With template literals, you can simply write the string across multiple lines, and the formatting is preserved:

let poem = `Roses are red, Violets are blue, JavaScript is fun, And so are you.`; console.log(poem);

Another feature of template literals is that they allow you to embed JavaScript expressions directly within the string, like in this example:

const song = "Bohemian Rhapsody"; const score = 9.5; const highestScore = 10; const output = `One of my favorite songs is "${song}". I rated it ${ (score / highestScore) * 100 }%.`; console.log(output);

Template literals are particularly useful when you need to include variables or expressions in strings, format complex strings, or work with multiline text. They are more concise and readable compared to traditional string concatenation.

##### Questions

Which of the following symbols is used to define a template literal?

What is string interpolation used for in template literals?

Which of the following is a feature of template literals that makes them better suited for writing multiline strings compared to regular strings?

### 📝 MCQs on this page

**Q1. Which of the following symbols is used to define a template literal?**

- **A.** Single quotes (')
- **B.** Double quotes (")
- **C.** Backticks (`)
- **D.** Square brackets ([])

**Q2. What is string interpolation used for in template literals?**

- **A.** Combining multiple strings without any variables.
- **B.** Inserting variables and expressions directly into a string.
- **C.** Changing the type of a string to a number.
- **D.** Creating functions that manipulate strings.

**Q3. Which of the following is a feature of template literals that makes them better suited for writing multiline strings compared to regular strings?**

- **A.** Template literals automatically capitalize all letters.
- **B.** Template literals preserve line breaks without needing escape characters.
- **C.** Template literals allow for mathematical operations on strings.
- **D.** Template literals require less memory to store strings.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- Template literals are JavaScript strings written with backticks (`` ` ``) instead of single or double quotes.
- They allow **string interpolation**, which means inserting variables or expressions directly into a string using `${...}`.
- They make strings easier to read, especially when combining multiple variables.
- They support multiline strings without needing `\n` escape characters.
- They can include JavaScript expressions inside the string, such as calculations or function calls.

## What the MCQs are asking
- Which symbol defines a template literal?
  - Answer: backticks (`` ` ``)
- What is string interpolation used for in template literals?
  - Answer: embedding variables or expressions inside a string using `${...}`
- Which feature makes template literals better for multiline strings?
  - Answer: they preserve line breaks naturally, without needing `\n`

## What it means
- Template literals are a cleaner way to build strings than using `+` concatenation.
- String interpolation lets you put dynamic values directly into the text.
- Multiline support makes template literals useful for messages, HTML snippets, poems, or formatted output.
- Embedding expressions means you can compute values inside the string, not just insert variables.

## Most important things to know
- Use backticks (`` ` ``) for template literals.
- Use `${variable}` or `${expression}` to insert values.
- Template literals are easier to read than string concatenation.
- They support multiline strings directly.
- They can include calculations, function calls, or other JavaScript expressions inside the string.
