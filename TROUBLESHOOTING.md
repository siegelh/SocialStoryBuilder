# Troubleshooting Guide

## Error: "Unexpected token 'c', "const conf"... is not valid JSON"

### What This Means
The `/api/debug` endpoint is returning JavaScript source code instead of executing it. This means the Azure Functions runtime is not running properly.

### Possible Causes

1. **Azure Functions Core Tools not installed**
2. **SWA CLI not properly configured**
3. **Wrong port being used (localhost:3000 instead of localhost:4280)**

## Solutions

### Solution 1: Install Azure Functions Core Tools

The Azure Functions Core Tools are required to run Azure Functions locally.

**Install via npm (recommended):**
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

**Or install via Chocolatey (Windows):**
```bash
choco install azure-functions-core-tools
```

**Or install via MSI:**
Download from: https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local

After installation, verify:
```bash
func --version
```

### Solution 2: Verify SWA CLI Installation

Make sure the Azure Static Web Apps CLI is installed:

```bash
npm install -g @azure/static-web-apps-cli
```

Verify installation:
```bash
swa --version
```

### Solution 3: Check Your Node Version

Azure Functions requires a specific Node.js version. Check your `.nvmrc` file or use:

```bash
node --version
```

If you're using nvm, switch to the correct version:
```bash
nvm use
```

### Solution 4: Run the Correct Command

Make sure you're using:
```bash
npm start
```

**NOT:**
- `npm run dev`
- `npm run build && npm run preview`
- `vite`

### Solution 5: Check the Terminal Output

When you run `npm start`, you should see output like:

```
Azure Static Web Apps emulator started at http://localhost:4280
Connected to API running at http://localhost:7071
```

If you see errors about "func" not being found, you need to install Azure Functions Core Tools (Solution 1).

### Solution 6: Manual Start (Alternative)

If `npm start` isn't working, you can manually start both servers:

**Terminal 1 - Start the API:**
```bash
cd api
npm start
```

**Terminal 2 - Start the Frontend:**
```bash
npm run dev
```

Then manually configure your frontend to point to `http://localhost:7071/api` instead of `/api`.

### Solution 7: Check for Port Conflicts

If something is already running on port 4280 or 7071, the SWA CLI won't start properly.

**Find what's using a port (Windows):**
```bash
netstat -ano | findstr :4280
netstat -ano | findstr :7071
```

**Kill the process:**
```bash
taskkill /PID <process_id> /F
```

## Verification Steps

After trying the solutions above, verify everything is working:

1. **Start the app:**
   ```bash
   npm start
   ```

2. **Check the console output** - You should see:
   - Azure Functions runtime starting
   - Vite dev server starting
   - SWA CLI connecting them together

3. **Open your browser** to the URL shown (should be `http://localhost:4280`)

4. **Check the browser console** - You should see:
   ```
   Using local.settings.json for configuration
   Environment Variable Status: { AZURE_TEXT_ENDPOINT: true, ... }
   ```

5. **Test the debug endpoint manually:**
   Open `http://localhost:4280/api/debug` in your browser
   - You should see JSON like: `{"AZURE_TEXT_ENDPOINT":true,...}`
   - If you see JavaScript code, the Functions runtime isn't running

## Still Having Issues?

### Check the SWA CLI logs
The SWA CLI should show detailed logs about what's happening. Look for error messages about:
- "func" command not found → Install Azure Functions Core Tools
- Port already in use → Kill the conflicting process
- Configuration errors → Check `swa-cli.config.json`

### Verify your file structure
```
DreamWeaver/
├── api/
│   ├── shared/
│   │   └── config.js
│   ├── debug/
│   │   ├── function.json
│   │   └── index.js
│   ├── text/
│   │   ├── function.json
│   │   └── index.js
│   ├── image/
│   │   ├── function.json
│   │   └── index.js
│   ├── host.json
│   ├── package.json
│   ├── local.settings.json  ← Should exist for local dev
│   └── node_modules/
├── src/
├── package.json
├── swa-cli.config.json
└── vite.config.ts
```

### Check local.settings.json exists
```bash
# Should exist and contain your API keys
cat api/local.settings.json
```

If it doesn't exist, create it (see `api/README.md` for the structure).
