# POST /v1/content/document

!!! warning "🚧 Beta API Notice"
The Generate API is currently in beta.
Functionality, rate limits, and pricing are subject to change.

Creates a presentation using raw slide content instead of generating from topic.

### 🔒 Authorization

Requires `checkWorkspace`.

### 📥 Request Body


| Field    | Type          | Required | Description                                                                          |
| ---------- | --------------- | ---------- | -------------------------------------------------------------------------------------- |
| `name`   | string        | ✅       | Name of the presentation.                                                            |
| `slides` | string (JSON) | ✅       | JSON stringified array of slides.                                                    |
| `type`   | string        | Optional | Defaults to`'ideatodeck'`.                                                           |
| `domain` | string        | Optional | Optional context domain.                                                             |
| `file`   | string        | Optional | file type ( .txt, .docx, .odt, .epub, .pdf, .html, .htm, .tsv, .json, .xls, .xlsx ). |

Example `slides` format:

```json
[
  {
    "title": "Slide 1",
    "content": "This is the first slide"
  },
  {
    "title": "Slide 2",
    "content": "This is the second slide"
  }
]
```

- **Success (200)**
  ```json
  {
    "status": 0,
    "message": "Presentation created successfully",
    "docurl": "{{ config.extra.docurl }}/docs/view/123",
    "insertid": 123
  }
  ```
  
  - **Failure**
  ```json
  {
    "status": 1,
    "error": "Error message"
  }
  ```
