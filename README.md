# Simple To Do List

A small **to do list** made with **HTML**, **CSS** and **JavaScript**.  
You can add tasks, mark them as done, delete them, and the list is saved in your browser.

## How to use locally

1. Open `index.html` in your browser (Chrome, Edge, etc.).
2. Type a task in the text box.
3. Click **Add** (or press Enter) to add the task.
4. Click the checkbox to mark a task as completed.
5. Click **Delete** to remove a task.
6. Click **Clear completed tasks** to remove all finished tasks at once.

Your tasks are stored in **localStorage**, so they stay after reloading the page.

## Files

- `index.html` – the main page and structure of the app.
- `style.css` – the visual style (colors, layout, fonts).
- `script.js` – the logic of the to do list.
- `README.md` – this explanation file (good for GitHub).

## How to put this on GitHub

1. Create a new repository on GitHub (for example: `todo-list`).
2. On your computer, put these files in a folder with the same name.
3. In that folder, open a terminal and run:

   ```bash
   git init
   git add .
   git commit -m "Simple to do list in HTML, CSS and JS"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

4. Refresh the page on GitHub – your code should be there.
5. (Optional) Enable **GitHub Pages** as described above to get a live demo link.

