# Lightchain AI API Documentation

## Overview

The Lightchain AI API provides zk-proof generation and verification services for the LighterYield application. This API is essential for enabling users to prove ownership of collateral without revealing sensitive information, allowing them to access margin for trading without transferring their assets.

## Base URL

```
https://api.lightchain.ai
```

## Authentication

All requests to the Lightchain AI API require authentication using a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Generate Proof

Generates a zk-proof for a given collateral asset.

**Endpoint:** `/api/v1/proofs/submit`

**Method:** POST

**Request Body:**

```json
{
  "address": "0x1234...5678",
  "assetType": "ETH",
  "amount": 10.5,
  "network": "ethereum"
}
```

**Response:**

```json
{
  "proofId": "proof_1234567890",
  "proofHash": "0xabcd...ef12",
  "status": "pending",
  "timestamp": "2023-09-03T12:34:56Z"
}
```

### Verify Proof

Verifies a previously generated zk-proof.

**Endpoint:** `/api/v1/proofs/verify`

**Method:** GET

**Query Parameters:**

- `proofHash`: The hash of the proof to verify

**Response:**

```json
{
  "proofHash": "0xabcd...ef12",
  "status": "verified",
  "verifiedAt": "2023-09-03T12:40:23Z"
}
```

### Get Collateral Status

Retrieves the status of collateral and associated proofs.

**Endpoint:** `/api/v1/collateral/status`

**Method:** GET

**Query Parameters:**

- `address`: The address to check

**Response:**

```json
{
  "address": "0x1234...5678",
  "collateral": [
    {
      "assetType": "ETH",
      "amount": 10.5,
      "proofStatus": "verified",
      "proofHash": "0xabcd...ef12",
      "lastUpdated": "2023-09-03T12:40:23Z"
    }
  ]
}
```

### Initiate Margin Trade

Initiates a margin trade using a verified proof.

**Endpoint:** `/api/v1/trade/margin`

**Method:** POST

**Request Body:**

```json
{
  "proofId": "proof_1234567890",
  "asset": "BTC",
  "position": "long",
  "amount": 0.5,
  "leverage": 2
}
```

**Response:**

```json
{
  "tradeId": "trade_0987654321",
  "status": "executed",
  "entryPrice": 50000,
  "timestamp": "2023-09-03T13:15:42Z",
  "details": {
    "asset": "BTC",
    "position": "long",
    "amount": 0.5,
    "leverage": 2,
    "liquidationPrice": 45000
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limits

- 100 requests per minute per API key
- 1,000 requests per hour per API key
- 10,000 requests per day per API key

## Webhooks

Lightchain AI supports webhooks for real-time notifications of proof verification status changes.

**Webhook Configuration Endpoint:** `/api/v1/webhooks/configure`

**Method:** POST

**Request Body:**

```json
{
  "url": "https://your-app.com/webhooks/lightchain",
  "events": ["proof.verified", "proof.failed"]
}
```

**Webhook Payload Example:**

```json
{
  "event": "proof.verified",
  "proofId": "proof_1234567890",
  "proofHash": "0xabcd...ef12",
  "timestamp": "2023-09-03T12:40:23Z"
}
```

## SDK

Lightchain AI provides a JavaScript SDK for easier integration:

```javascript
import { LightchainClient } from '@lightchain/sdk';

const client = new LightchainClient('YOUR_API_KEY');

// Generate a proof
const proof = await client.generateProof({
  address: '0x1234...5678',
  assetType: 'ETH',
  amount: 10.5,
  network: 'ethereum'
});

// Verify a proof
const verification = await client.verifyProof(proof.proofHash);

// Get collateral status
const status = await client.getCollateralStatus('0x1234...5678');

// Initiate a margin trade
const trade = await client.initiateMarginTrade({
  proofId: proof.proofId,
  asset: 'BTC',
  position: 'long',
  amount: 0.5,
  leverage: 2
});
```

## Best Practices

1. **Caching**: Cache proof verification results to minimize API calls
2. **Error Handling**: Implement proper error handling for all API calls
3. **Webhooks**: Use webhooks for real-time updates instead of polling
4. **Rate Limiting**: Respect rate limits and implement backoff strategies
5. **Security**: Store API keys securely and never expose them to clients

