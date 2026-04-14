# POST /v1/document/slide

!!! warning "🚧 Beta API Notice"
    The Generate API is currently in beta.
    Functionality, rate limits, and pricing are subject to change.

Updates slide content for an existing document.

### 🔒 Authorization
Requires `checkWorkspace`.

### 📥 Request Body

| Field      | Type   | Required | Description                            |
|------------|--------|----------|----------------------------------------|
| `docId`    | number | ✅       | Document ID to update.                 |
| `slides`   | string (JSON) | ✅ | JSON array of slide content objects.  |

Each slide object in the array must include:

| Slide Field    | Type    | Description                      |
|----------------|---------|----------------------------------|
| `action`       | string  | Type of update (e.g., `update`). |
| `slideContent` | string  | The updated slide text.          |
| `index`        | number  | Position of the slide.           |

### 📤 Response

- **Success (200)**

    ```json
    {
    "status": 0,
    "message": "Slides updated successfully"
    }
    ```


- **Failure **

```json

{
  "status": 1,
  "error": "Slide content cannot be empty"
}
