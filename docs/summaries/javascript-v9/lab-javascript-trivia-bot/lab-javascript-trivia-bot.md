# Build a JavaScript Trivia Bot: Build a JavaScript Trivia Bot | freeCodeCamp.org

> Source: https://www.freecodecamp.org/learn/javascript-v9/lab-javascript-trivia-bot/lab-javascript-trivia-bot · Saved 8/25/2026, 11:32:22 AM

## Original Content

#### Build a JavaScript Trivia Bot

Objective: Fulfill the user stories below and get all the tests to pass to complete the lab.

User Stories:
- You should log "Hello! I'm your coding fun fact guide!" to the console as a greeting message to the user.
- You should create three variables: botName, botLocation, and favoriteLanguage, that store the bot's name, where it's from, and its favorite programming language, respectively.
- You should log "My name is (botName) and I live on (botLocation)." to the console.
- You should log "My favorite programming language is (favoriteLanguage)." to the console.
- You should use let to create a codingFact variable and assign it a string that is a fun fact about the bot's favorite programming language, using the favoriteLanguage variable.
- You should log the codingFact to the console.
- You should reassign the codingFact variable to a new fact about the bot's favorite programming language using the favoriteLanguage variable again.
- You should log the codingFact to the console again.
- You should reassign the codingFact variable to a third fact about the bot's favorite programming language using the favoriteLanguage variable again.
- You should log the codingFact to the console a third time.
- You should log "It was fun sharing these facts with you. Goodbye! - (botName) from (botLocation)." to the console as a farewell statement from the bot.

##### Tests:
- Waiting: 1. You should log "Hello! I'm your coding fun fact guide!" to the console.
- Waiting: 2. You should declare a botName variable. Double check for any spelling or casing errors.
- Waiting: 3. Your botName variable should be a string.
- Waiting: 4. You should declare a botLocation variable. Double check for any spelling or casing errors.
- Waiting: 5. Your botLocation variable should be a string.
- Waiting: 6. You should declare a favoriteLanguage variable. Double check for any spelling or casing errors.
- Waiting: 7. Your favoriteLanguage variable should be a string.
- Waiting: 8. You should log to the console "My name is (botName) and I live on (botLocation)." and add the variables to the string.
- Waiting: 9. You should log to the console "My favorite programming language is (favoriteLanguage)." and add the variable to the string.
- Waiting: 10. You should use let to declare a new variable codingFact.
- Waiting: 11. You should give codingFact a value that includes favoriteLanguage.
- Waiting: 12. You should log codingFact to the console.
- Waiting: 13. You should assign a new value to codingFact that also contains favoriteLanguage, and log it to the console.
- Waiting: 14. You should assign a value to codingFact for the third time that also contains favoriteLanguage, and log it to the console.
- Waiting: 15. You should log to the console "It was fun sharing these facts with you. Goodbye! - (botName) from (botLocation)." and add the values of the variables.

/** * Your test output will go here */

<!--FFCAMP-SPLIT-->

## What the topic is explaining
- This is a beginner JavaScript lab where you build a simple “trivia bot” that prints messages to the console.
- You need to create and use variables to store the bot’s name, location, and favorite programming language.
- You need to use `console.log()` to print specific greeting, fact, and farewell messages.
- You need to use `let` for a variable called `codingFact` so it can be reassigned multiple times.
- Each fact must include the `favoriteLanguage` variable, showing how variables can be reused inside strings.

## What the MCQs are asking
- There are no multiple-choice questions on this page.
- The lab tests ask you to:
  - Log the exact greeting: `"Hello! I'm your coding fun fact guide!"`
  - Declare `botName`, `botLocation`, and `favoriteLanguage` as string variables.
  - Log the exact introduction using `botName` and `botLocation`.
  - Log the exact favorite-language sentence using `favoriteLanguage`.
  - Declare `codingFact` with `let`.
  - Assign `codingFact` a string that includes `favoriteLanguage`.
  - Log `codingFact` three times after reassigning it three times.
  - Log the exact farewell using `botName` and `botLocation`.

## What it means
- This exercise is testing basic JavaScript syntax, not advanced logic.
- It shows how to store data in variables and reuse that data in messages.
- It shows how `let` allows a variable to be changed later, unlike `const`.
- It shows how to combine variables with text, usually using template literals like:
  - `` `My name is ${botName} and I live on ${botLocation}.` ``
- The “bot” is just a sequence of printed messages that use stored values.

## Most important things to know
- Use the exact variable names: `botName`, `botLocation`, `favoriteLanguage`, and `codingFact`.
- `botName`, `botLocation`, and `favoriteLanguage` must be strings.
- Use `let` for `codingFact`, not `const`, because it must be reassigned.
- `codingFact` must be assigned three different values, and each value must include `favoriteLanguage`.
- Log `codingFact` after each assignment.
- The console messages must match the required wording exactly.
- Use template literals or string concatenation to insert variable values into the messages.
- The final message must include both `botName` and `botLocation`.
