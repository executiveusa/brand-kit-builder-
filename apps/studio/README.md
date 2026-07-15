# Pauli Brand Studio shell

A bilingual, dependency-free studio interface adapted from the most useful interaction patterns identified in Open CoDesign:

- three-panel creative workspace;
- live preview canvas;
- responsive viewport controls;
- files, comments, claims, rights, history, and deliverable dock;
- structured brand controls;
- optional host bridge for the guarded Brand Kit Builder core;
- first-run product tour;
- English and Mexican Spanish localization.

## Run

From the repository root:

```bash
npm run studio
```

Open `http://127.0.0.1:4173`.

The server binds only to localhost. The browser shell makes no network requests. When no desktop host bridge is present, all actions run in demo mode.

## Tour behavior

- Starts automatically once per browser profile.
- Completion is stored under `pauli-brand-studio-tour-v1-complete`.
- Restart from the **Tour / Recorrido** button.
- Force with `?tour=1`.

## Host bridge

A desktop wrapper may expose:

```js
window.brandKitBuilderHost = {
  invoke(command, payload) {
    // Route to the guarded CLI/MCP adapter.
  }
};
```

The shell never receives provider secrets and does not write project state directly.
