# Working with Strings in JavaScript - What Is the prompt() Method, and How Does It Work? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-working-with-strings-in-javascript/what-is-the-prompt-method-and-how-does-it-work · Saved 8/25/2026, 5:03:11 PM

## Original Content

#### What Is the prompt() Method, and How Does It Work?

The prompt() method is an important part of JavaScript's interaction with the user. It’s one of the simplest ways to get input from a user through a small pop-up dialog box.

You'll often see it used in cases where the webpage needs a piece of information from the user, such as a name or some other form of text input.

So, what exactly does the prompt() method do? It opens a dialog box that asks the user for some input, and then it returns the text entered by the user as a string.

The prompt() method takes two arguments: The first one is the message which will appear inside the dialog box, typically prompting the user to enter information. And the second one is a default value which is optional and will fill the input field initially.

prompt(message, default);

Here's an example of how it works.

NOTE: This example includes code you have not learned yet. Don't worry about trying to understand everything in the code. This is just to illustrate how the prompt() method works and ensure that the prompt doesn't appear immediately when the page loads which can be seen as intrusive. If you have the interactive editor enabled, you can try it out yourself.

<button id="prompt-btn">Show Prompt</button> <p id="output"></p> <script src="index.js"></script>

const btn = document.getElementById("prompt-btn"); const output = document.getElementById("output"); btn.addEventListener("click", () => { const userName = prompt("What is your name?", "Guest"); output.textContent = "Hello, " + userName + "!"; });

In this example, when the user clicks on the button, the prompt() method displays a dialog box with the message What is your name? and an input field that initially contains the value Guest.

If the user types their name and presses "OK", the userName variable will store the entered value. If the user presses "Cancel," the userName variable will be set to null. null signifies that the user did not provide any input. The output paragraph will then display a greeting message using the provided name or null if the user canceled. You will learn techniques to avoid displaying null when a user cancels the prompt in future lessons.

Keep in mind that the prompt() method will halt the execution of the script until the user interacts with the dialog box.

This means the rest of your JavaScript code won’t run until the user either provides input and clicks "OK", or cancels the prompt.

One other point to consider is that while prompt() is useful for quick testing or small applications, it's generally avoided in modern, complex web applications due to its disruptive nature and inconsistent behavior across different browsers.

By understanding the prompt() method, you gain a simple way to interact with users and retrieve information directly through the browser, even though it may not be widely used in modern web applications.

##### Questions

What does the prompt() method do in JavaScript?

What happens if the user cancels the prompt dialog box?

What is the second, optional argument of the prompt() method used for?

### 📝 MCQs on this page

**Q1. What does the prompt() method do in JavaScript?**

- **A.** Displays a pop-up asking for user input and returns the input as a string.
- **B.** Logs a message to the console.
- **C.** Opens a new browser window.
- **D.** Stops the script from executing.

**Q2. What happens if the user cancels the prompt dialog box?**

- **A.** The script breaks.
- **B.** The prompt method returns null.
- **C.** The prompt method returns an empty string.
- **D.** The script continues with the default value.

**Q3. What is the second, optional argument of the prompt() method used for?**

- **A.** Specifying the text of the cancel button.
- **B.** Setting a default value in the input field.
- **C.** Setting a time limit for the input.
- **D.** Changing the color of the dialog box.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- `prompt()` is a JavaScript method that opens a small browser dialog box to ask the user for input.
- It returns the user’s entered text as a **string**.
- It takes two arguments:
  - `message`: the text shown in the dialog box.
  - `default`: an optional value that appears in the input field before the user types.
- Example syntax:
  - `prompt("What is your name?", "Guest")`
- If the user clicks **OK**, the entered value is returned.
- If the user clicks **Cancel**, the method returns `null`.
- While the prompt is open, JavaScript execution pauses until the user responds.
- It is useful for simple examples or testing, but it is usually avoided in modern web apps because it is intrusive and behaves inconsistently across browsers.

## What the MCQs are asking
- The first question asks what the `prompt()` method does in JavaScript.
- The second question asks what happens if the user cancels the prompt dialog box.
- The third question asks what the second, optional argument of `prompt()` is used for.

## What it means
- `prompt()` is a simple way to get text input directly from a user.
- The result can be used in code, but you must be ready for `null` if the user cancels.
- The optional second argument lets you pre-fill the input field with a default value.
- Because `prompt()` blocks the script, the rest of the code waits until the user clicks OK or Cancel.
- It is mainly a beginner/testing tool, not a recommended method for polished user interfaces.

## Most important things to know
- `prompt(message, default)`
- `message` is required.
- `default` is optional and pre-fills the input box.
- Returns a **string** if the user clicks OK.
- Returns **`null`** if the user clicks Cancel.
- The script pauses while the prompt is open.
- Avoid using `prompt()` in modern, complex web applications.
