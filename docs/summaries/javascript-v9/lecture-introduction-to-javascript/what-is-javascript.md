# Introduction to JavaScript - What Is JavaScript, and How Does It Work with HTML and CSS? | Learn | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lecture-introduction-to-javascript/what-is-javascript · Saved 8/24/2026, 4:56:16 PM

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
- JavaScript is a programming language that adds interactivity and dynamic behavior to websites
- HTML structures content, CSS styles elements, JavaScript enables behavior
- Examples of behavior: handling clicks, form submissions, hover menus, animations, building web apps
- Example shows HTML for an h1 and button, CSS makes h1 green, JavaScript shows alert on button click via `onclick`
- The three work together: HTML = structure, CSS = styling, JavaScript = behavior

## What the MCQs are asking
- What role does JavaScript play in web development compared to HTML and CSS
- How JavaScript typically interacts with HTML and CSS on a webpage
- Which statement is true about the relationship between JavaScript, HTML, and CSS

## What it means
- JavaScript is the behavior layer that makes static HTML/CSS pages interactive
- It hooks into HTML elements and reacts to user input, and can change content or styles
- It does not replace HTML or CSS; it works with them to create a complete experience
- Interaction happens through events like click and DOM manipulation

## Most important things to know
- HTML provides structure, CSS adds styling, JavaScript enables behavior
- JavaScript runs in the browser to handle user input, animations and app logic
- In the example, `onclick="alert('Button clicked!')"` ties a JS action to an HTML button
- The three technologies are complementary and together create interactive web experiences
