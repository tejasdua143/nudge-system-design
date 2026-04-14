# Presentations.AI Developer Documentation

Welcome to Presentations.AI's comprehensive developer documentation. Our platform provides powerful AI-driven tools for creating professional presentations through both **REST API** and **MCP (Model Context Protocol)** integration.

!!! info "🎯 What You'll Find Here"
    Complete guides for integrating Presentations.AI into your applications, from simple API calls to advanced MCP server connections with Claude Desktop.

---

## 🚀 **Quick Overview**

**Presentations.AI** enables developers to:

- **Generate presentations** from topics using advanced AI
- **Create single slides** for focused content and quick generation
- **Transform files** into presentations (PDFs, documents, spreadsheets)
- **Create custom presentations** from structured content
- **Integrate with Claude Desktop** via MCP server for conversational presentation creation

### **🚀 Two Powerful Integration Methods**

<div class="grid cards" markdown>

- **🔗 REST API Integration**

    Traditional HTTP API for developers

    - Simple HTTP requests with JSON responses
    - Bearer token authentication
    - Perfect for web apps, mobile apps, and backend services
    - [Get Started with REST API →](quickstart.md)

- **🤖 MCP Integration (Recommended)**

    **Revolutionary Claude Desktop integration** for conversational AI experiences

    -  **Natural language** presentation creation
    -  **Seamless Claude Desktop** workflow
    -  **Real-time collaboration** with AI
    -  **Perfect for AI-powered productivity**
    - [Set up MCP Integration →](mcp-v1/create-document-from-content.md)

</div>


---

### **Try MCP Integration**

!!! success "🚀 **Fastest Way to Get Started** (2 minutes setup)"
    Skip complex API calls! Create presentations by talking to Claude Desktop:

    **1. Install Claude Desktop** → [Download here](https://claude.ai/download)

    **2. Add MCP Server** → [Follow our setup guide](mcp-v1/create-document-from-content.md)

    **3. Start Creating!**
    ```
    "Hey Claude, create a 7-slide presentation about digital marketing trends for 2024"
    ```

    **That's it!** Claude will generate, edit, and export your presentation automatically.

### **MCP in Action**

```markdown
You: "Create a presentation about AI in healthcare with 8 slides"

Claude: I'll create that presentation for you! Let me generate 8 slides about AI in healthcare.

✅ Generated: "AI in Healthcare - Transforming Patient Care.pptx"
📥 Download: https://cdn.presentations.ai/exports/199943/...

Create additional content?

You: "Create same presentation on same topic with 15 slides"

Claude: I'll create a new presentation on the same topic with 15 slides...
✅ Generated: "AI in Healthcare - Transforming Patient Care.pptx" (15 slides)
📥 Download: https://cdn.presentations.ai/exports/199944/...
```

---

## 🔗 **Or Use REST API**

Prefer traditional API integration? Get started with REST API in under 5 minutes:

### 1. Get Your API Key dev-apis.presentations.ai
[Register at ]({{ config.extra.developer_url_login }}) and get your free API key (200 credits included).

### 2. Create Your First Presentation

```bash
curl -X POST {{ config.extra.developer_url }}/api/v1/topic/document \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "topic=Introduction to Machine Learning" \
  -F "slideCount=8" \
  -F "language=en" \
  -F "domain=presentations.ai" \
  -F "exportType=ppt" \
  # Optional: include a file (PDF, Word, PowerPoint, or text)
  -F "file=@/path/to/yourfile.pdf"'
```

### 3. Success Response
```json
{
    "status": 0,
    "docid": 199943,
    "docurl": "{{ config.extra.docurl }}/exports/199943/1755583984885/Digital%20Marketing%20for%20Small%20Businesses.pptx",
    "animated_url": "{{ config.extra.docurl }}/exports/199943/1755583984566/Digital%20Marketing%20for%20Small%20Businesses_animated.pptx"
}
```

!!! success "🎉 That's it!"
    Your AI-generated presentation is ready! Visit the `docurl` to view, edit, or download your presentation.

---

## 📚 **Documentation Sections**

<div class="grid cards" markdown>

- **🤖 [MCP Integration](mcp-v1/create-document-from-content.md)** ⭐ **Recommended**

    **Revolutionary** Claude Desktop integration for conversational AI presentation creation

- **[Getting Started](register/register.md)**

    Account registration, API key setup, and authentication

- **[REST API Reference](v1/topic-document.md)**

    Complete REST API documentation with examples

</div>

---

## 🔑 **Authentication**

All API requests require authentication using your API key as a Bearer token:

```http
Authorization: Bearer YOUR_API_KEY
```

### Code Examples:

=== "JavaScript (Fetch)"
    ```javascript
    const response = await fetch('{{ config.extra.developer_url }}/api/v1/topic/document', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: 'Your presentation topic',
        slideCount: 10,
        exportType: 'ppt'
      })
    });
    ```

=== "JavaScript (Axios)"
    ```javascript
    const response = await axios.post('{{ config.extra.developer_url }}/api/v1/topic/document', {
      topic: 'Your presentation topic',
      slideCount: 10,
      exportType: 'ppt'
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    ```

=== "TypeScript"
    ```typescript
    interface PresentationRequest {
      topic: string;
      slideCount: number;
      exportType: 'ppt' | 'pdf';
    }

    const data: PresentationRequest = {
      topic: 'Your presentation topic',
      slideCount: 10,
      exportType: 'ppt'
    };

    const response = await fetch('{{ config.extra.developer_url }}/api/v1/topic/document', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    ```

=== "Python"
    ```python
    import requests

    headers = {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }

    data = {
        'topic': 'Your presentation topic',
        'slideCount': 10,
        'exportType': 'ppt'
    }

    response = requests.post(
        '{{ config.extra.developer_url }}/api/v1/topic/document',
        headers=headers,
        json=data
    )
    ```

=== "PHP"
    ```php
    <?php
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => '{{ config.extra.developer_url }}/api/v1/topic/document',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode([
            'topic' => 'Your presentation topic',
            'slideCount' => 10,
            'exportType' => 'ppt'
        ]),
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer YOUR_API_KEY',
            'Content-Type: application/json'
        ),
    ));

    $response = curl_exec($curl);
    curl_close($curl);
    ?>
    ```

=== "Java"
    ```java
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.net.URI;
    import java.time.Duration;
    import java.io.IOException;

    try {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

        String jsonData = """
            {
                "topic": "Your presentation topic",
                "slideCount": 10,
                "exportType": "ppt"
            }
            """;

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("{{ config.extra.developer_url }}/api/v1/topic/document"))
            .header("Authorization", "Bearer YOUR_API_KEY")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonData))
            .build();

        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        System.out.println("Response: " + response.body());
    } catch (IOException | InterruptedException e) {
        System.err.println("Error: " + e.getMessage());
    }
    ```

=== "C#"
    ```csharp
    using System;
    using System.Net.Http;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;

    public class PresentationClient
    {
        private static readonly HttpClient client = new HttpClient();

        public static async Task<string> CreatePresentation()
        {
            var data = new
            {
                topic = "Your presentation topic",
                slideCount = 10,
                exportType = "ppt"
            };

            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, 
                "{{ config.extra.developer_url }}/api/v1/topic/document")
            {
                Content = content
            };
            request.Headers.Add("Authorization", "Bearer YOUR_API_KEY");

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }
    }
    ```

=== "Go"
    ```go
    package main

    import (
        "bytes"
        "encoding/json"
        "fmt"
        "io"
        "net/http"
        "time"
    )

    type PresentationRequest struct {
        Topic       string `json:"topic"`
        SlideCount  int    `json:"slideCount"`
        ExportType  string `json:"exportType"`
    }

    func main() {
        data := PresentationRequest{
            Topic:      "Your presentation topic",
            SlideCount: 10,
            ExportType: "ppt",
        }

        jsonData, err := json.Marshal(data)
        if err != nil {
            fmt.Printf("Error marshaling JSON: %v", err)
            return
        }

        client := &http.Client{Timeout: 10 * time.Second}
        req, err := http.NewRequest("POST", 
            "{{ config.extra.developer_url }}/api/v1/topic/document", 
            bytes.NewBuffer(jsonData))
        if err != nil {
            fmt.Printf("Error creating request: %v", err)
            return
        }

        req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
        req.Header.Set("Content-Type", "application/json")

        resp, err := client.Do(req)
        if err != nil {
            fmt.Printf("Error making request: %v", err)
            return
        }
        defer resp.Body.Close()

        body, err := io.ReadAll(resp.Body)
        if err != nil {
            fmt.Printf("Error reading response: %v", err)
            return
        }

        fmt.Printf("Response: %s\n", body)
    }
    ```

=== "Rust"
    ```rust
    use reqwest;
    use serde_json::json;

    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
        let client = reqwest::Client::new();

        let data = json!({
            "topic": "Your presentation topic",
            "slideCount": 10,
            "exportType": "ppt"
        });

        let response = client
            .post("{{ config.extra.developer_url }}/api/v1/topic/document")
            .header("Authorization", "Bearer YOUR_API_KEY")
            .header("Content-Type", "application/json")
            .json(&data)
            .send()
            .await?;

        let response_text = response.text().await?;
        println!("Response: {}", response_text);
        Ok(())
    }
    ```

=== "Swift"
    ```swift
    import Foundation

    struct PresentationRequest: Codable {
        let topic: String
        let slideCount: Int
        let exportType: String
    }

    func createPresentation() async throws {
        let url = URL(string: "{{ config.extra.developer_url }}/api/v1/topic/document")!
        
        let data = PresentationRequest(
            topic: "Your presentation topic",
            slideCount: 10,
            exportType: "ppt"
        )
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer YOUR_API_KEY", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let encoder = JSONEncoder()
        request.httpBody = try encoder.encode(data)
        
        let (responseData, response) = try await URLSession.shared.data(for: request)
        
        if let httpResponse = response as? HTTPURLResponse {
            print("Status code: \(httpResponse.statusCode)")
        }
    }
    ```

---

## 🛟 **Need Help?**

- **Email Support**: [support@presentations.ai](mailto:support@presentations.ai)


!!! tip "💡 Pro Tip"
    Start with our **Getting Started** guide for a step-by-step walkthrough, or jump directly to the **API Reference** if you're ready to integrate.