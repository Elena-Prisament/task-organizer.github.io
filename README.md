# Quest Log

## Project Overview

This is a static web application implementing a Kanban-style task board themed as "quests". The app consists of a home page (`index.html`) linking to the main quest board (`quest.html`), with drag-and-drop functionality for organizing tasks across time-based columns.

## Architecture

- **Static HTML/CSS/JS**: No build tools or frameworks required. Files are served directly from the filesystem.
- **Entry Points**:
  - `index.html`: Landing page with navigation to the quest board
  - `quest.html`: Main application with sidebar and board layout
- **Key Components**:
  - Sidebar: Contains draggable default tasks and motivator emojis
  - Board: 4-column grid (Today, Tomorrow, Aftermorrow, Long-term) with contenteditable dropzones
  - Drag Logic: Implemented in `script.js` using native HTML5 drag/drop API

## Core Patterns

- **Drag and Drop**: Use `cloneNode(true)` to duplicate dragged items into dropzones (see `script.js` lines 12-15)
- **Contenteditable Dropzones**: Allow direct text input in columns for custom tasks (see `quest.html` dropzone elements)
- **Theming**: Tasks prefixed with emojis, motivators are cute characters you can drag and drop onto tasks!
- **Navigation**: Simple `window.location.href` for page transitions (see `goHome()` function)

## Development Workflow

- **No Build Required**: Open `index.html` directly in a browser to run the app
- **File Structure**: All assets in root directory - HTML, CSS, JS files are siblings
- **Styling**: CSS Grid used for board layout (`grid-template-columns: repeat(4, 1fr)` in `styles.css`)
- **Debugging**: Use browser dev tools; no console logging or error handling implemented

## Code Conventions

- **HTML**: Semantic elements (`<aside>` for sidebar, `<main>` for board)
- **CSS**: Utility-first approach with custom properties; box-sizing border-box globally
- **JavaScript**: Vanilla ES6+ with event listeners; no modules or bundling
- **Naming**: Class names use kebab-case (e.g., `dropzone`, `task-list`); functions use camelCase

## Key Files to Reference

- `script.js`: Drag/drop implementation and navigation logic
- `styles.css`: Layout and theming (app vs home styles)
- `quest.html`: Template structure with data attributes (unused `data-column`)

## Common Tasks

- Adding new tasks: Append `<div class="task" draggable="true">New Task</div>` to `.task-list`
- Modifying columns: Update `<h3>` text and ensure 4-column grid in CSS
- Styling changes: Edit `styles.css` with focus on flex/grid layouts and color scheme (#1f2333 sidebar, #f5f7fb background)
