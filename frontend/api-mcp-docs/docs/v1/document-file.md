# Create Presentation from File

!!! warning "🚧 Beta API Notice"
    The File to Presentation API is currently in beta.
    Functionality, rate limits, and pricing are subject to change.

This endpoint allows you to create presentations directly from uploaded files. Upload documents, PDFs, spreadsheets, or text files and let AI transform them into professional presentations.

---

## POST `/api/v1/document/file`

Creates a presentation from an uploaded file using AI content analysis and generation.

### **Authorization**
Include your API key in the `Authorization` header as a Bearer token.

---

### **Request Parameters**
| Field            | Type   | Required | Description                                    |
|------------------|--------|----------|------------------------------------------------|
| `file`           | file   | Yes      | Content file to convert to presentation        |
| `topic`          | string | Optional | Override topic (if not provided, extracted from file). You can use this to instruct the AI, for example: "Split content as it is into slides". The API will primarily use the content in the uploaded file to generate slides. |
| `slideCount`     | number | Optional | Number of slides to generate (1-50)           |
| `language`       | string | Optional | Language for generation (default: English)    |
| `domain`         | string | Optional | Context domain (e.g., education, business)    |
| `exportType`     | string | Yes      | One of `ppt`, `pptx`, `pdf`, `image`, `render`, `share` |
| `tone`           | string | Optional | Tone of the presentation (e.g., professional, casual, educational). |
| `targetAudience` | string | Optional | Target audience for the presentation (e.g., students, executives). |
| `callback_url`   | string | Optional | HTTPS URL to receive async callback notification. |
| `preservationMode` | string | Optional | How to handle the source content. One of `enhance` (default), `preserve`, `summarize`, `instruction`. |

### **Supported File Formats**
- **Text**: `.txt`
- **Documents**: `.docx`, `.odt`
- **eBooks**: `.epub`
- **PDFs**: `.pdf`
- **Web**: `.html`, `.htm`
- **Data**: `.tsv`, `.json`, `.xls`, `.xlsx`

---

### **File Size Limit**

Maximum file size is **1MB**. If you upload a file larger than this, you will receive:

```json
{
    "status": 1,
    "error": "File size exceeds maximum limit of 1MB"
}
```

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

If you do **not** provide a `callback_url`, the result will be returned directly in the API response.

### **Preservation Modes (file → deck)**
- `enhance` (default): AI enhances and structures the deck. `slideCount` validated (1-50).
- `preserve`: Keep the original order/structure; `slideCount` is ignored (no need to send it).
- `summarize`: Condense the content; `slideCount` validated (1-50).
- `instruction`: Follow custom instructions; **topic is required** and used as the instruction text. `slideCount` validated (1-50).

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

### **Example Request (cURL)**
```bash
curl -X POST {{ config.extra.developer_url }}/api/v1/document/file \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -F "file=@/path/to/your/document.pdf" \
  -F "topic=Annual Report Highlights" \
  -F "slideCount=10" \
  -F "language=en" \
  -F "domain=presentations.ai" \
  -F "exportType=ppt" \
  -F "tone=professional" \
  -F "targetAudience=executives" \
  -F "preservationMode=instruction" \
  -F "callback_url=https://yourdomain.com/api/callback"
```

---

## **Response Formats**

The response format depends on the **`exportType`** parameter:

<details>
<summary><strong> exportType = ppt/pptx</strong> (Editable PowerPoint File)</summary>

Success (200):
```json
{
    "status": 0,
    "docid": 199950,
    "docurl": "{{ config.extra.docurl }}/exports/199950/1755583984885/Market%20Analysis%20Report.pptx",
    "animated_url": "https://devcdn.presentations.ai/exports/199950/1755583984566/Market%20Analysis%20Report_animated.pptx"
}
```

Failure (400, 500):
```json
{
  "status": 1,
  "error": "Please provide a content file"
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
    "docid": 199951,
    "docurl": "{{ config.extra.docurl }}/pdfs/199951/Market%20Analysis%20Report.pdf",
    "animated_url": null
}
```

Failure:
```json
{
  "status": 1,
  "error": "Failed to generate PDF from file"
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
    "docid": 199952,
    "docurl": "{{ config.extra.docurl }}/pdfs/199952/Market%20Analysis%20Report.zip",
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
    "docid": 199953,
    "docurl": "{{ config.extra.docurl }}/docs/edit/199953"
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
    "docid": 199954,
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

## **Error Handling**

### **File-Specific Errors**

```json
{
  "status": 1,
  "error": "File size exceeds maximum limit of 1MB"
}
```
**Solution**: Reduce file size or use async processing with `callback_url`.

```json
{
  "status": 1,
  "error": "Please provide a content file"
}
```
**Solution**: Ensure the `file` parameter contains a valid file upload.

```json
{
  "status": 1,
  "error": "Unsupported file format"
}
```
**Solution**: Use one of the supported file formats listed above.

```json
{
  "status": 1,
  "error": "Unable to extract content from file"
}
```
**Solution**: Ensure the file contains readable text content and is not corrupted.

---

## **Usage Notes**
- **Topic Guidance**: Use the `topic` field to instruct the AI, e.g., "Split content as it is into slides". The file content is the main source for slide generation.
- **Tone & Target Audience**: Use `tone` to set the style (e.g., professional, casual, educational) and `targetAudience` to tailor content for specific groups (e.g., students, executives).
- **Callback URL**: If provided and valid, results will be sent asynchronously to your endpoint. If invalid, you will receive an error message.

For more details about error handling, see our [Error Handling Guide](../error-handling.md).