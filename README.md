# Copy Error ‑ VS Code Extension

Save a few seconds (and your sanity) every time you need to share an error message with your team or an AI assistant. **Copy Error** adds a tiny clipboard icon to the gutter next to each diagnostic (error, warning, or info). One click copies the exact message text to your clipboard – no more selecting, right-clicking or fiddling with pop-ups.

---

## ✨ Features

* **One-click copy** – Clipboard icon appears inline with the error underline; click to copy the full diagnostic message.
* **Works everywhere** – Uses VS Code’s built-in diagnostics, so it supports TypeScript, JavaScript, Python, Go, Rust … anything that reports problems.
* **AI-friendly output** – Plain-text message only (no file path, code, or decorations) – perfect for pasting into an LLM prompt.
* **Zero configuration** – Install and go.

---

## 📸 Screenshots

> _Add screenshots or a short GIF after the UI is implemented._

---

## 🚀 Getting Started (Development)

1. **Clone & install**
   ```bash
   git clone https://github.com/your-handle/copy-error.git
   cd copy-error
   npm install
   ```
2. **Launch Extension Host**
   * Press <kbd>F5</kbd> in VS Code to open a Development Host window with the extension loaded.
3. **Try it out**
   * Open a file with a TypeScript error.
   * Hover the red underline – a 📋 icon appears in the gutter. Click it – the message is now on your clipboard.

---

## 🛠 Commands

| Command ID | Title | Description |
|------------|-------|-------------|
| `copy-error.copyDiagnostic` | Copy Diagnostic Message | Copies the message(s) for the diagnostic at the cursor position.

The command is also exposed via the gutter icon decoration, so you rarely need to invoke it manually.

---

## ⚙️ Extension Settings

_No settings yet – everything just works._

---

## 🗺 Roadmap

* [ ] Setting: include file/line info in copied text
* [ ] Support multi-cursor copy (copy all diagnostics for all selections)
* [ ] “Copy all diagnostics in file” command
* [ ] Option to automatically format as Markdown / code block

---

## 🤝 Contributing

Pull requests and issues are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines (to be added).

---

## 📄 License

MIT © 2025 Your Name
