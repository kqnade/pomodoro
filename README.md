# Pomodoro

A cozy, no-login pomodoro timer desktop app built with Tauri + React.

## Install

### Windows
Download the `.msi` or `.exe` from [Releases](../../releases) and run it.

> The app is built for Windows 10/11 and does not require admin rights.

### macOS
Download the `.dmg` from [Releases](../../releases) and drag the app to Applications.

### Linux
Download the `.deb` or `.AppImage` from [Releases](../../releases).

For Fedora: `sudo dnf install webkit2gtk4.1-devel` (build dependency only).

## Development

### Requirements
- [Rust](https://rustup.rs/)
- [Node.js](https://nodejs.org/) + [pnpm](https://pnpm.io/)
- [mise](https://mise.jdx.dev/) (optional but recommended)

### Windows setup
```powershell
# Install Rust
winget install Rustlang.Rustup

# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Run dev
pnpm tauri dev
```

### macOS / Linux setup
```bash
# Install dependencies
pnpm install

# Run dev
pnpm tauri dev
# or with mise
mise run dev
```

### Commands
| Command | Description |
|---|---|
| `pnpm tauri dev` | Run in dev mode |
| `pnpm test` | Run frontend tests (Vitest) |
| `pnpm tauri build` | Build desktop installer |
| `mise run ci` | Run full CI check |

## Features

- **No login** — everything stays on your machine
- **Focus / Short Break / Long Break** cycles
- **Stats** — today, this week, and total focus time (stored in localStorage)
- **Customizable** — adjust durations and sessions per cycle
- **Cozy UI** — matcha green, warm cream, soft shadows

## Tech Stack

- [Tauri v2](https://tauri.app/) — Rust-based desktop framework
- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/) — testing with fake timers
