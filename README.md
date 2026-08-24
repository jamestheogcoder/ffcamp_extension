# ffcamp_extension

Chrome extension with a built-in AI side panel.

- **Summarize** the current page into structured Markdown study notes and save them to GitHub (`ffcamp-summaries/` folder) or download locally.
- **MCQ Solver**: paste multiple-choice questions, get reasoned answers via OpenRouter.
- Bring your own keys: an [OpenRouter](https://openrouter.ai/keys) API key and a GitHub fine-grained token (Contents: Read & Write).

## Install (unpacked)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder
4. Pin the icon, open the panel, add your keys in **Settings**

## Stack

Manifest V3 · vanilla HTML/CSS/JS · OpenRouter API (`openrouter/free` by default) · GitHub Contents API
