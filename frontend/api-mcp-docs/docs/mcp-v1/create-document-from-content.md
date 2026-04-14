# 🤖 MCP Integration: Create Presentations with Natural Language

!!! success "🌟 **Revolutionary Presentation Creation**"
    Transform the way you create presentations! Instead of complex API calls, simply **chat with Claude Desktop** to generate professional presentations instantly.

    **"Create a 10-slide presentation about renewable energy for executives"** → ✨ **Done in seconds!**

This guide shows you how to connect the Presentations.AI MCP server to Claude Desktop, enabling **conversational presentation creation** directly in your chats.

## 🚀 **Why Choose MCP Integration?**

<div class="grid cards" markdown>

- **🗣️ Natural Language**

    No coding required - just describe what you want

- **🔄 Interactive Editing**

    "Make slide 3 more technical" - Claude updates instantly

- **🎯 AI-Powered**

    Claude understands context and creates relevant content

- **📦 Export Options**

    Includes all the export types same as REST APIs

</div>

---

## 1️⃣ Prerequisites
- **Claude Desktop** installed (latest version)  
  Download: [https://claude.ai/download](https://claude.ai/download)  
- A **hosted Presentations.AI MCP server** running at a valid URL (e.g., `{{ config.extra.developer_url }}/mcp`)  
- An **API key** from Presentations.AI  
  Obtain it by registering at [{{ config.extra.developer_portal }}]({{ config.extra.developer_portal }})  

> 💡 Ensure Claude Desktop is updated via the "Check for Updates" option in the Claude menu.

---

## 2️⃣ Locate Claude Desktop Configuration File

Claude Desktop uses a file named `claude_desktop_config.json` to configure MCP servers.

- **macOS**  
  ```
  ~/Library/Application Support/Claude/claude_desktop_config.json
  ```

- **Windows**  
  ```
  %APPDATA%\Claude\claude_desktop_config.json
  ```

> 💡 If the file doesn’t exist, create it in the specified directory using a text editor like VS Code or Notepad++.

---

## 3️⃣ Add Your Remote MCP Server Configuration

Edit (or create) `claude_desktop_config.json` and add your Presentations.AI remote MCP server details using the `mcp-remote` launcher:

```json
{
  "mcpServers": {
    "presentationsai": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "{{ config.extra.developer_url }}/mcp",
        "--header",
        "Authorization: Bearer YOUR_API_KEY"
      ]
    }
  }
}
```

### Explanation:
- **`mcpServers`**: A map of named MCP servers (e.g., `presentationsai`). The name can be customized.
- **`command`**: Uses `npx` to run the `mcp-remote` package, which connects to remote MCP servers.
- **`args`**: 
  - `mcp-remote` specifies the remote server connection.
  - The URL (`{{ config.extra.developer_url }}/mcp`) is the endpoint for the Presentations.AI MCP server (verify the exact URL from Presentations.AI documentation).
  - The API key is passed via the `--header` flag for authentication.

> 💡 Replace `YOUR_API_KEY` with the API key obtained from [{{ config.extra.developer_portal }}]({{ config.extra.developer_portal }}). Ensure the `mcp-remote` package is available in your environment or managed by your system administrator.

---

## 4️⃣ Restart Claude Desktop

After saving changes to `claude_desktop_config.json`:
1. Quit Claude Desktop completely (ensure it’s not running in the background).
2. Restart the application.
3. Claude will automatically connect to your Presentations.AI remote MCP server.

> 💡 On Windows, use Task Manager to confirm Claude Desktop is fully closed. On macOS, use Activity Monitor or run `pkill Claude` in the terminal.

---

## 5️⃣ Verify the Integration

To confirm the MCP server is connected:
- Open Claude Desktop and start a new conversation.
- Click the **hammer icon** (or tools icon) in the conversation input area to view available MCP tools.
- Look for the `presentationsai` server or its tools (e.g., presentation creation tools).
- Alternatively, check the developer console (View → Toggle Developer Tools) for logs like:
  ```
  ✅ Connected to MCP server: presentationsai
  ```
- Test the integration by asking Claude to create a presentation, e.g., “Create a 5-slide presentation on renewable energy using Presentations.AI.”

> 💡 If the server doesn’t appear, verify the URL is correct and the server is accessible. Check logs in `~/Library/Logs/Claude/mcp.log` (macOS) or `%APPDATA%\Claude\mcp.log` (Windows) for errors.

---

## 🔹 Troubleshooting

| Issue | Possible Cause | Fix |
|-------|----------------|-----|
| MCP server not detected | Incorrect JSON syntax or file path | Validate JSON syntax (use a JSON linter) and confirm file path. |
| Connection refused | Wrong or unreachable server URL | Verify the URL with Presentations.AI support. |
| Auth errors | Invalid or expired API key | Regenerate the API key at [{{ config.extra.developer_portal }}]({{ config.extra.developer_portal }}). |
| Tools not showing | Claude Desktop not restarted | Fully quit and restart Claude Desktop. |

> 💡 For additional debugging, enable debug logging in Claude Desktop settings (Settings → Developer → Enable Debug Logging) and review logs in the Extensions settings panel or `mcp.log` file.

---

## 🔹 Example Usage

Once connected, you can use natural language in Claude Desktop to interact with the Presentations.AI MCP server. Examples:
- “Create a 10-slide presentation on digital marketing using Presentations.AI.”
- “Generate a PDF presentation about AI trends with 5 slides.”


The server will process these requests using the Presentations.AI API endpoints (`POST /v1/topic/document`, `POST /v1/content/document`, or `POST /v1/document/slide`), and Claude will return the results, such as a download link or confirmation.


---

## 🔹 Additional Notes
- **Security**: Keep your `claude_desktop_config.json` file and API key secure, as they contain sensitive information. Use your operating system’s secure storage (e.g., Keychain on macOS, Credential Manager on Windows) for API keys if possible.
- **Multiple Servers**: You can add multiple MCP servers in the `mcpServers` object by defining additional entries with unique names.
- **Desktop Extensions (DXT)**: If Presentations.AI provides a `.dxt` file for their MCP server, you can install it via Claude Desktop’s Extensions settings for a simpler setup (Settings → Extensions → Install Extension).

For further assistance, contact Presentations.AI support at [support@presentations.ai](mailto:support@presentations.ai) or visit [Anthropic’s Help Center](https://support.anthropic.com) for Claude Desktop issues.