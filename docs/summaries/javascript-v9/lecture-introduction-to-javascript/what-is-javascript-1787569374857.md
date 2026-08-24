# Introduction to JavaScript - What Is JavaScript, and How Does It Work with HTML and CSS? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-javascript/what-is-javascript · Saved 8/24/2026, 4:47:52 PM

## Original Content

#### What Is JavaScript, and How Does It Work with HTML and CSS?

JavaScript is a powerful programming language that brings interactivity and dynamic behavior to websites.

While HTML and CSS are used to structure content and style elements on a page, JavaScript goes beyond those by enabling more complex functionality, such as handling user input, animating elements, and even building full web applications.

For example, when you click a button, submit a form, or hover over a menu, JavaScript determines how the page behaves.

Here's an example of how these three work together:

<!DOCTYPE html> <html> <head> <style> h1 { color: green; } </style> </head> <body> <h1>Hello, World!</h1> <button onclick="alert('Button clicked!')">Click me</button> </body> </html>

In this example, HTML is used to define the content: a heading (an h1 element) and a button (the button element).

CSS is used to apply styles to the heading, such as making the text green. JavaScript is used to display an alert message when the button is clicked.

To sum up, HTML provides structure, CSS adds styling, and JavaScript enables behavior, creating a complete and interactive web experience.

##### Questions

What role does JavaScript play in web development compared to HTML and CSS?

How does JavaScript typically interact with HTML and CSS on a webpage?

Which of the following is true about the relationship between JavaScript, HTML, and CSS?

### 📝 MCQs on this page

**Q1. What role does JavaScript play in web development compared to HTML and CSS?**

- **A.** JavaScript provides structure to the webpage and ensures that your code is free of errors.
- **B.** JavaScript provides the styles for the web page and automatically formats your code.
- **C.** JavaScript provides interactive functionality and dynamic behavior for the web page.
- **D.** JavaScript is only used to create advanced animations for web applications.

**Q2. How does JavaScript typically interact with HTML and CSS on a webpage?**

- **A.** JavaScript adds more styles to the CSS file and more elements to the HTML file.
- **B.** JavaScript creates a new version of HTML for the page so your HTML code will run faster.
- **C.** JavaScript interacts with the page to change content and styles dynamically.
- **D.** JavaScript only works in the back-end and is rarely used in the front-end.

**Q3. Which of the following is true about the relationship between JavaScript, HTML, and CSS?**

- **A.** HTML is a programming language and CSS is a stylesheet language, while JavaScript is a markup language.
- **B.** HTML is a markup language and CSS is a stylesheet language, while JavaScript is a programming language.
- **C.** JavaScript can replace HTML and CSS.
- **D.** JavaScript does not work with HTML and CSS.


<!--FFCAMP-SPLIT-->

## What the topic is explaining
- JavaScript is a programming language that adds interactivity and dynamic behavior to websites.
- HTML provides structure/content, CSS provides styling, JavaScript provides behavior.
- Example shows HTML for `<h1>` and `<button>`, CSS for `h1 { color: green; }`, JavaScript via `onclick="alert('Button clicked!')"` to show an alert on click.
- User actions like click, submit, hover are handled by JavaScript to determine page behavior.

## What the MCQs are asking
- What role does JavaScript play in web development compared to HTML and CSS?
- How does JavaScript typically interact with HTML and CSS on a webpage?
- Which statement is true about the relationship between JavaScript, HTML, and CSS?

## What it means
- JavaScript does not replace HTML/CSS; it works with them to make pages interactive.
- HTML defines elements that exist on the page, CSS defines how they look, JavaScript defines what they do in response to users.
- Interaction is via DOM hooks like event attributes `onclick`, which let JS react to HTML elements and can change styles/content.
- The three form a stack: structure → style → behavior for a complete web experience.

## Most important things to know
- HTML = structure, CSS = styling, JavaScript = behavior/interactivity.
- JavaScript enables handling user input, animations, and full web apps beyond static markup.
- JS typically attaches to HTML elements and can read/modify them, often affecting CSS styles dynamically.
- The example demonstrates all three working together in one simple page.
