# 🚨 Error Handling Guide

This comprehensive guide covers all possible errors you might encounter when using the Presentations.AI API, along with solutions and best practices.

!!! info "📋 Error Response Format"
    All API errors follow a consistent format with status codes and descriptive messages to help you debug quickly.

---

## 📊 **Standard Error Response**

All API endpoints return errors in this format:

```json
{
  "status": 1,
  "error": "Descriptive error message"
}
```

### Response Fields:
- **`status`**: Always `1` for errors, `0` for success
- **`error`**: Human-readable error description
- **HTTP Status Code**: Standard HTTP status codes (400, 401, 402, 500, etc.)

---

## 🔐 **Authentication Errors (401)**

### Invalid API Key
```json
{
  "status": 1,
  "error": "Invalid API key"
}
```

**Causes:**
- API key is incorrect or malformed
- API key has been reset/regenerated
- Missing or malformed Authorization header

**Solutions:**
- Verify your API key in the developer portal
- Ensure header format: `Authorization: Bearer YOUR_API_KEY`
- Generate a new API key if necessary

### Missing Authorization Header
```json
{
  "status": 1,
  "error": "Unauthorized access"
}
```

**Solution:**
```bash
# ❌ Wrong - Missing header
curl -X POST {{ config.extra.developer_url }}/v1/topic/document

# ✅ Correct - With authorization
curl -X POST {{ config.extra.developer_url }}/v1/topic/document \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 💳 **Payment & Credits Errors (402)**

### Insufficient Credits
```json
{
  "status": 1,
  "error": "Insufficient credits for this operation"
}
```

**Solutions:**
- [Purchase more credits]({{ config.extra.developer_portal }})
- Contact support for billing issues

### Account Suspended
```json
{
  "status": 1,
  "error": "Account suspended. Contact support."
}
```

**Solution:** Contact [support@presentations.ai](mailto:support@presentations.ai) for account resolution.

---

## ❌ **Request Validation Errors (400)**

### Empty or Invalid Topic
```json
{
  "status": 1,
  "error": "Topic cannot be empty"
}
```

**Solutions:**
```javascript
// ❌ Wrong - Empty topic
{
  "topic": "",
  "exportType": "ppt"
}

// ✅ Correct - Descriptive topic
{
  "topic": "Introduction to Machine Learning Algorithms",
  "exportType": "ppt"
}
```

### Invalid Slide Count
```json
{
  "status": 1,
  "error": "Slide count must be between 1 and 50"
}
```

**Valid Range:** 1-50 slides

```javascript
// ❌ Wrong
{
  "topic": "AI Overview",
  "slideCount": 100
}

// ✅ Correct
{
  "topic": "AI Overview", 
  "slideCount": 25
}
```

### Invalid Export Type
```json
{
  "status": 1,
  "error": "Invalid export type. Must be: ppt, pptx, pdf, image, render, or share"
}
```

**Valid Export Types:**
- `ppt` - PowerPoint file (.ppt format)
- `pptx` - PowerPoint file (.pptx format) 
- `pdf` - PDF document
- `image` - Preview images
- `render` - Rendered presentation
- `share` - Shareable link

---


## ⚠️ **Server Errors (500)**

### Internal Server Error
```json
{
  "status": 1,
  "error": "Internal server error. Please try again later."
}
```

**Solutions:**
- Wait a few minutes and retry
- Contact support if persistent

---



## 🆘 **Getting Help**

When contacting support, please include:

1. **Error message** (complete JSON response)
2. **Request details** (endpoint, method, parameters)
3. **Timestamp** of the error
4. **Your API key** (last 4 characters only)
5. **Registered email address associated with your API key** (the one used during key generation)
6. **Expected behavior** vs actual behavior

**Contact Information:**
- **Email**: [support@presentations.ai](mailto:support@presentations.ai)


!!! tip "💡 Pro Tips"
    - Always validate input before sending requests
    - Implement proper error handling and retries for server errors
    - Cache successful responses when possible
    - Monitor your credit usage proactively
