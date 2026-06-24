# Storyfied

Turn any messy ticket into a clean, AI-ready brief - in one click.

Storyfied is a Chrome extension that reads the ticket you're viewing on **any**
board (GitHub Projects, Azure DevOps, Jira, Trello, and more) and uses AI to turn
it into a tidy summary you can paste straight into an AI coding agent.

## Install

1. Add Storyfied from the Chrome Web Store and confirm **Add extension**.
2. Pin the Storyfied icon to your toolbar.
3. Open Storyfied's options and paste your **Gemini API key**
   ([get one free from Google AI Studio](https://aistudio.google.com/apikey)).

> **Required:** a Gemini API key. It's free to grab, you add it once, and it's
> stored locally in your browser - never sent anywhere except Google's API.

## How to use it

1. Open the ticket you want to work on, on any board.
2. Click the Storyfied icon. It reads the ticket and the AI:
   - pulls out the fields - title, type, priority, labels, size/points, status,
     assignee;
   - rewrites the description into clear requirements (loose one-liners get
     expanded, long writeups get tightened) and drafts acceptance criteria.
3. Each field shows up as an editable row - tweak anything you like.
4. Click **Copy to clipboard** and paste the brief into your AI agent. Done.

Nothing is invented: fields that aren't on the ticket are left blank rather than
made up.

## Settings

- **Gemini API key** - your own key, stored locally.
- **Model** - defaults to a fast Gemini model; change it if you prefer another.
- **Extra instructions** - optional, e.g. "write acceptance criteria in Gherkin".
