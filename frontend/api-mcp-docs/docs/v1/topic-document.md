# Presentations.AI API Documentation

!!! warning "🚧 Beta API Notice"
    The Generate API is currently in beta.
    Functionality, rate limits, and pricing are subject to change.

This document describes the key endpoints of the Presentations.AI API for creating and managing AI-generated presentations. All endpoints require authentication using a Bearer token obtained from [{{ config.extra.developer_portal }}]({{ config.extra.developer_portal }}).

!!! info "📚 Available Endpoints"
    - **[Create from Topic](topic-document.md)** - Generate multi-slide presentations from topics
    - **[Create Single Slide](topic-singleslide.md)** - Generate focused single-slide presentations
    - **[Create from File](document-file.md)** - Transform uploaded files into presentations

---

## POST `/api/v1/topic/document`

Creates a presentation from a given topic using AI.

### **Authorization**
Include your API key in the `Authorization` header as a Bearer token.

---

### **Request Body**
| Field            | Type   | Required | Description                                    |
|------------------|--------|----------|------------------------------------------------|
| `topic`          | string | Yes      | The main topic of the presentation.            |
| `slideCount`     | number | Optional | Number of slides to generate (1-50).           |
| `language`       | string | Optional | Language for generation (default: English).    |
| `domain`         | string | Optional | Context domain (e.g., education, business).    |
| `exportType`     | string | Yes      | One of `ppt`, `pptx`, `pdf`, `image`, `render`, `share`. |
| `file`           | string | Optional | File type (`.txt`, `.docx`, `.odt`, `.epub`, `.pdf`, `.html`, `.htm`, `.tsv`, `.json`, `.xls`, `.xlsx`). |
| `targetAudience` | string | Optional | Target audience for the presentation (e.g., students, executives). |
| `tone`           | string | Optional | Tone of the presentation (e.g., professional, casual, educational). |
| `callback_url`   | string | Optional | HTTPS URL to receive async callback notification. |

---

### **Callback URL Flow**

If you provide a valid `callback_url`, the API will respond immediately with a job ID and queue status:

**Immediate Response (with valid callback_url):**
```json
{
    "job_id": "b1ed6035-1872-49d1-b773-34b920e74204",
    "status": "queued"
}
```

**Immediate Response (with invalid callback_url):**
```json
{
    "status": 1,
    "error": "Invalid callback_url. Must be a valid HTTPS URL"
}
```

When processing is complete, the result (same as the synchronous response below) will be POSTed to your callback URL.

**If you do not provide a `callback_url` (synchronous flow):**

The response will be returned directly in the API call, depending on `exportType`:

### **Timeout & Polling (no `callback_url`)**
- If processing takes longer than **5 minutes**, the API returns immediately while continuing in the background.
- You will receive:
```json
{
  "status": 1,
  "pollUrl": "{{ config.extra.developer_url }}/api/v1/polljob/<job_id>"
}
```
- Poll the job status with `GET {{ config.extra.developer_url }}/api/v1/polljob/<job_id>` (same Bearer token).
  - In-progress response:
  ```json
  {
    "status": 1,
    "message": "Document is being processed"
  }
  ```
  - Completed response mirrors the success format for your `exportType`.

---

## **Response depends on the `exportType`**

Choose the **`exportType`** to view its corresponding response format:

<details>
<summary><strong> exportType = ppt/pptx</strong> (Editable PowerPoint File)</summary>

Success (200):
```json
{
    "status": 0,
    "docid": 199943,
    "docurl": "{{ config.extra.docurl }}/exports/199943/1755583984885/Digital%20Marketing%20for%20Small%20Businesses.pptx",
    "animated_url": "https://devcdn.presentations.ai/exports/199943/1755583984566/Digital%20Marketing%20for%20Small%20Businesses_animated.pptx"
}
```

Failure (400, 500):
```json
{
  "status": 1,
  "error": "Topic cannot be empty"
}
```
</details>

---

<details>
<summary><strong> exportType = pdf</strong> (Sharable PDF)</summary>

Success (200):
```json
{
    "status": 0,
    "docid": 199926,
    "docurl": "{{ config.extra.docurl }}/pdfs/199926/Digital%20Marketing%20for%20Small%20Businesses.pdf",
    "animated_url": null
}
```

Failure:
```json
{
  "status": 1,
  "error": "Failed to generate PDF"
}
```
</details>

---

<details>
<summary><strong> exportType = image</strong> (Slide Images)</summary>

Success (200):
```json
{
    "status": 0,
    "docid": 199953,
    "docurl": "{{ config.extra.docurl }}/pdfs/199953/Digital%20Marketing%20for%20Small%20Businesses.zip",
    "animated_url": null
}
```

Failure:
```json
{
  "status": 1,
  "error": "Image generation failed"
}
```
</details>

---

<details>
<summary><strong> exportType = render</strong> (Rendered Preview)</summary>

Success (200):
```json
{
    "status": 0,
    "docid": 199944,
    "docurl": "{{ config.extra.docurl }}/docs/edit/199944"
}
```

Failure:
```json
{
  "status": 1,
  "error": "Failed to render presentation"
}
```
</details>

---

<details>
<summary><strong> exportType = share</strong> (Public Shareable Link)</summary>

Success (200):
```json
{
    "status": 0,
    "docid": 199945,
    "docurl": "{{ config.extra.docurl }}/view/YJJOFilucT"
}
```

Failure:
```json
{
  "status": 1,
  "error": "Failed to create share link"
}
```
</details>

---

### **Usage Notes**
- **Authentication**: Obtain your API key from [{{ config.extra.developer_portal }}]({{ config.extra.developer_portal }}/) and include it as `Authorization: Bearer <your-api-key>`.
- **Export Types**:
    - `ppt/pptx` → Downloadable PowerPoint
    - `pdf` → Sharable PDF
    - `image` → Slide previews in image format
    - `render` → Rendered preview of the presentation
    - `share` → Public shareable link
- **Best Practices**: Specify `domain` for better context, use descriptive topics, and test with small `slideCount` values initially.
- **Target Audience & Tone**: Use `targetAudience` to tailor content for specific groups (e.g., students, executives) and `tone` to set the style (e.g., professional, casual, educational).
- **Callback URL**: If provided and valid, results will be sent asynchronously to your endpoint. If invalid, you will receive an error message.

---

For more details, visit [Presentations.AI](https://app.presentations.ai) or contact [support@presentations.ai](mailto:support@presentations.ai).