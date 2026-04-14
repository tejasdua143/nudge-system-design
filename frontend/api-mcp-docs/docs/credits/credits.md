# 📊 Credits API

APIs related to GPT credit pricing, usage history, and availability for different workspaces. All endpoints are prefixed with `/credits`.

---

### 1. GET `/credits/getApiCredits`

Fetch pricing plans for GPT usage for a specific workspace, considering user’s IP location.

### 🔐 Authorization

Requires user to be authenticated (`req.session.pd.user`).

### 🧾 Query Parameters

| Parameter       | Type   | Required | Description                         |
|-----------------|--------|----------|-------------------------------------|
| `workspaceId`   | number | ✅       | Workspace ID to fetch pricing for. |

- **Success Response**

    ```json
    {
    "status": 0,
    "plans": [
        {
        "id": 1,
        "name": "Pro Plan",
        "currency": "USD",
        "credit": "100",
        "symbol": "$",
        "unformattedPrice": 10,
        "price": "10.00"
        },
        ...
    ]
    }

    ```
- **Failure Response**
  ```json
  {
    "status": 1,
    "msg": "Error message"
  }
  ```




### 2. GET `/credits/getWorkspaceGpt3History`

Fetch usage history of GPT-3 credits for a given workspace with optional pagination.

### 🔐 Authorization

Requires user to be authenticated (`req.session.pd.user`).

### 🧾 Query Parameters

| Parameter       | Type   | Required | Description                         |
|-----------------|--------|----------|-------------------------------------|
| `workspaceId`   | number | ✅       | Workspace ID to fetch pricing for. |

- **Success Response**

    ```json
    {
    "status": 0,
    "history": [
        {
        "id": 101,
        "usedAt": "2025-07-29T09:41:00Z",
        "credits": 10,
        "description": "Slide generation"
        },
        ...
    ],
    "count": 123
    }

    ```

- **Failure**
  ```json
  {
    "status": 1,
    "msg": "Error message"
  }
  ```


### 3. GET `/credits/getCredits`

Get pricing plans for GPT usage based on user’s geolocation via IP.


### 🔐 Authorization

Requires user to be authenticated (`req.session.pd.user`).


- **Success Response**

    ```json
    {
    "status": 0,
    "plans": [
        {
        "id": 1,
        "name": "Starter Plan",
        "currency": "USD",
        "credit": "50",
        "symbol": "$",
        "unformattedPrice": 5,
        "price": "5.00"
        },
    ...
    ]
    }
    ```

- **Failure**
  ```json
  {
    "status": 1,
    "msg": "An error occurred while processing your request"
  }
  ```


### 4. GET `/credits/getWorkspaceGpt3Details`

Get the remaining GPT-3 credits for a specific workspace.

### 🔐 Authorization

Requires user to be authenticated (`req.session.pd.user`).

### 🧾 Query Parameters

| Parameter       | Type   | Required | Description                         |
|-----------------|--------|----------|-------------------------------------|
| `workspaceId`   | number | ✅       | Workspace ID to fetch pricing for. |

- **Success Response**

    ```json
    {
    "status": 0,
    "credits": 500
    }

    ```

- **Failure**
    ```json
    {
    "status": 1,
    "msg": "Error message"
    }
    ```