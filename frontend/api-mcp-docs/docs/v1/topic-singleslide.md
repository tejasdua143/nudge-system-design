# Create Single Slide from Topic

!!! warning "🚧 Beta API Notice"
    The Single Slide API is currently in beta.
    Functionality, rate limits, and pricing are subject to change.

This endpoint allows you to create a single slide presentation from a given topic using AI. Perfect for quick slide generation or when you need just one slide for your content.

---

## POST `/api/v1/topic/singleslide`

Creates a single slide presentation from a given topic using AI.

### **Authorization**
Include your API key in the `Authorization` header as a Bearer token.

---

### **Request Body**
| Field            | Type   | Required | Description                                    |
|------------------|--------|----------|------------------------------------------------|
| `topic`          | string | Yes      | The main topic for the slide.                  |
| `language`       | string | Optional | Language for generation (default: English).    |
| `domain`         | string | Optional | Context domain (e.g., education, business).    |
| `file`           | file   | Optional | Additional reference file (`.txt`, `.docx`, `.odt`, `.epub`, `.pdf`, `.html`, `.htm`, `.tsv`, `.json`, `.xls`, `.xlsx`). |
| `targetAudience` | string | Optional | Target audience for the slide content.         |
| `tone`           | string | Optional | Tone of the content (professional, casual, etc.). |
| `callback_url`   | string | Optional | HTTPS URL to receive async callback notification. |

> **Note:**  
> The output will always be an image format.  
> The `exportType` parameter is **not accepted** for this endpoint.

---

### **Example Request**
```json
{
  "topic": "Introduction to Machine Learning",
  "language": "en",
  "domain": "presentations.ai",
  "targetAudience": "university students",
  "tone": "educational",
  "callback_url": "https://yourdomain.com/api/callback"
}
```

### **cURL Example**
```bash
curl -X POST {{ config.extra.developer_url }}/api/v1/topic/singleslide \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Key Benefits of Cloud Computing",
    "language": "en",
    "domain": "presentations.ai",
    "callback_url": "https://yourdomain.com/api/callback"
  }'
```

---

## **Callback URL Flow**

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

When processing is complete, the result will be POSTed to your callback URL:

**Callback Success Payload:**
```json
{
    "job_id": "b1ed6035-1872-49d1-b773-34b920e74204",
    "status": 0,
    "docid": 123456,
    "docurl": "https://cdn.presentations.ai/exports/123456/single-slide-image.png"
}
```

**Callback Error Payload:**
```json
{
    "status": 1,
    "error": "Failed to generate single slide"
}
```

If you do **not** provide a `callback_url`, the result will be returned directly in the API response.

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
  - Completed response mirrors the success format below.

---

## **Response Format**

Success (200):
```json
{
    "status": 0,
    "docid": 123456,
    "docurl": "https://cdn.presentations.ai/exports/123456/single-slide-image.png"
}
```

Failure (400, 500):
```json
{
  "status": 1,
  "error": "Topic cannot be empty"
}
```

---

## **Usage Notes**

- **Single Slide Focus**: This endpoint generates exactly one slide, making it perfect for key points, summaries, or standalone content.
- **File Support**: You can upload reference files to provide additional context for slide generation.
- **Target Audience**: Specify your audience to get more relevant content and appropriate complexity level.
- **Tone Control**: Set the tone to match your presentation style (professional, casual, educational, etc.).

### **Best Practices**
- Use specific, focused topics for better single-slide content.
- Specify `targetAudience` and `tone` for more relevant results.
- Consider using reference files for context-rich content.

---

For more details about error handling, see our [Error Handling Guide](../error-handling.md).