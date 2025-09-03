# Supabase API Documentation

## Overview

Supabase provides the backend database and authentication services for the LighterYield application. It is used for storing user data, collateral accounts, proofs, trades, and other application state.

## Base URL

```
https://YOUR_PROJECT_ID.supabase.co
```

## Authentication

Supabase supports two authentication methods:

1. **API Key Authentication**: For public endpoints
   ```
   apikey: YOUR_SUPABASE_KEY
   ```

2. **JWT Authentication**: For authenticated endpoints
   ```
   Authorization: Bearer USER_JWT_TOKEN
   ```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Collateral Accounts Table

```sql
CREATE TABLE collateral_accounts (
  account_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  network TEXT NOT NULL,
  address TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  yield_rate DECIMAL NOT NULL,
  yield_accrued DECIMAL NOT NULL,
  last_yield_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_value DECIMAL
);
```

### Proofs Table

```sql
CREATE TABLE proofs (
  proof_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  collateral_address TEXT NOT NULL,
  proof_hash TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verification_status TEXT NOT NULL,
  collateral_amount DECIMAL,
  asset_type TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
);
```

### Trades Table

```sql
CREATE TABLE trades (
  trade_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) NOT NULL,
  collateral_used TEXT NOT NULL,
  margin_access_proof_id UUID REFERENCES proofs(proof_id) NOT NULL,
  entry_price DECIMAL NOT NULL,
  exit_price DECIMAL,
  profit_loss DECIMAL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL,
  asset TEXT NOT NULL,
  position TEXT NOT NULL,
  leverage DECIMAL
);
```

### Yield Aggregators Table

```sql
CREATE TABLE yield_aggregators (
  aggregator_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  apy_endpoint TEXT NOT NULL,
  current_apy DECIMAL,
  description TEXT,
  risk_level TEXT,
  min_deposit DECIMAL,
  protocol TEXT
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  user_id UUID REFERENCES users(user_id) PRIMARY KEY,
  tier TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  features JSONB NOT NULL
);
```

## REST API Endpoints

### Get Data

Retrieves data from a table.

**Endpoint:** `/rest/v1/{table}`

**Method:** GET

**Query Parameters:**

- Various filter parameters (e.g., `user_id=eq.123`)
- `select`: Columns to select
- `order`: Order by column
- `limit`: Limit number of results
- `offset`: Offset for pagination

**Example:**

```
GET /rest/v1/collateral_accounts?user_id=eq.123&select=*
```

**Response:**

```json
[
  {
    "account_id": "acc_1",
    "user_id": "123",
    "network": "ethereum",
    "address": "0x1234...5678",
    "asset_type": "ETH",
    "amount": 12.5,
    "yield_rate": 4.2,
    "yield_accrued": 2.45,
    "last_yield_update": "2023-09-03T12:34:56Z",
    "current_value": 31250
  }
]
```

### Insert Data

Inserts data into a table.

**Endpoint:** `/rest/v1/{table}`

**Method:** POST

**Request Body:**

```json
{
  "user_id": "123",
  "network": "ethereum",
  "address": "0x1234...5678",
  "asset_type": "ETH",
  "amount": 12.5,
  "yield_rate": 4.2,
  "yield_accrued": 2.45,
  "last_yield_update": "2023-09-03T12:34:56Z",
  "current_value": 31250
}
```

**Response:**

```json
{
  "account_id": "acc_1",
  "user_id": "123",
  "network": "ethereum",
  "address": "0x1234...5678",
  "asset_type": "ETH",
  "amount": 12.5,
  "yield_rate": 4.2,
  "yield_accrued": 2.45,
  "last_yield_update": "2023-09-03T12:34:56Z",
  "current_value": 31250
}
```

### Update Data

Updates data in a table.

**Endpoint:** `/rest/v1/{table}`

**Method:** PUT

**Query Parameters:**

- Various filter parameters (e.g., `account_id=eq.acc_1`)

**Request Body:**

```json
{
  "yield_rate": 5.2,
  "yield_accrued": 3.1,
  "last_yield_update": "2023-09-04T12:34:56Z"
}
```

**Response:**

```json
{
  "account_id": "acc_1",
  "user_id": "123",
  "network": "ethereum",
  "address": "0x1234...5678",
  "asset_type": "ETH",
  "amount": 12.5,
  "yield_rate": 5.2,
  "yield_accrued": 3.1,
  "last_yield_update": "2023-09-04T12:34:56Z",
  "current_value": 31250
}
```

### Delete Data

Deletes data from a table.

**Endpoint:** `/rest/v1/{table}`

**Method:** DELETE

**Query Parameters:**

- Various filter parameters (e.g., `account_id=eq.acc_1`)

**Response:**

```json
{
  "account_id": "acc_1",
  "user_id": "123",
  "network": "ethereum",
  "address": "0x1234...5678",
  "asset_type": "ETH",
  "amount": 12.5,
  "yield_rate": 5.2,
  "yield_accrued": 3.1,
  "last_yield_update": "2023-09-04T12:34:56Z",
  "current_value": 31250
}
```

## Real-time Subscriptions

Supabase supports real-time subscriptions to database changes.

**Example:**

```javascript
const subscription = supabase
  .from('collateral_accounts')
  .on('*', (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## Authentication API

### Sign Up

Creates a new user.

**Endpoint:** `/auth/v1/signup`

**Method:** POST

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "created_at": "2023-09-03T12:34:56Z",
    "updated_at": "2023-09-03T12:34:56Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1677858242
  }
}
```

### Sign In

Signs in an existing user.

**Endpoint:** `/auth/v1/token`

**Method:** POST

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "created_at": "2023-09-03T12:34:56Z",
    "updated_at": "2023-09-03T12:34:56Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1677858242
  }
}
```

## SDK

Supabase provides a JavaScript SDK for easier integration:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_SUPABASE_KEY'
);

// Get data
const { data, error } = await supabase
  .from('collateral_accounts')
  .select('*')
  .eq('user_id', '123');

// Insert data
const { data, error } = await supabase
  .from('collateral_accounts')
  .insert({
    user_id: '123',
    network: 'ethereum',
    address: '0x1234...5678',
    asset_type: 'ETH',
    amount: 12.5,
    yield_rate: 4.2,
    yield_accrued: 2.45,
    last_yield_update: new Date().toISOString(),
    current_value: 31250
  });

// Update data
const { data, error } = await supabase
  .from('collateral_accounts')
  .update({
    yield_rate: 5.2,
    yield_accrued: 3.1,
    last_yield_update: new Date().toISOString()
  })
  .eq('account_id', 'acc_1');

// Delete data
const { data, error } = await supabase
  .from('collateral_accounts')
  .delete()
  .eq('account_id', 'acc_1');

// Authentication
const { user, session, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

const { user, session, error } = await supabase.auth.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

## Best Practices

1. **Row-Level Security**: Implement row-level security policies to restrict access to data
2. **Indexes**: Create indexes on frequently queried columns
3. **Transactions**: Use transactions for operations that require atomicity
4. **Caching**: Use Supabase's built-in caching to improve performance
5. **Real-time**: Use real-time subscriptions for live updates instead of polling

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Discord](https://discord.supabase.com/)

