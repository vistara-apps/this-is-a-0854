# Alchemy API Documentation

## Overview

The Alchemy API provides blockchain data and asset information for the LighterYield application. This API is used to fetch transaction data, asset balances, and other blockchain-related information for L1 collateral.

## Base URL

```
https://eth-mainnet.g.alchemy.com
```

## Authentication

Alchemy API requires an API key, which is included in the URL path:

```
/v2/{apiKey}/endpoint
```

## Endpoints

### Get Token Balances

Retrieves token balances for a given address.

**Endpoint:** `/v2/{apiKey}/getTokenBalances`

**Method:** GET

**Query Parameters:**

- `address`: The address to check

**Response:**

```json
{
  "address": "0x1234...5678",
  "tokenBalances": [
    {
      "contractAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "tokenBalance": "0x1a055690d9db80000"
    },
    {
      "contractAddress": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
      "tokenBalance": "0x1a055690d9db80000"
    }
  ]
}
```

### Get Asset Transfers

Retrieves asset transfers for a given address.

**Endpoint:** `/v2/{apiKey}/getAssetTransfers`

**Method:** GET

**Query Parameters:**

- `address`: The address to check
- `fromBlock`: The starting block (optional)
- `toBlock`: The ending block (optional)
- `contractAddresses`: List of contract addresses to filter by (optional)

**Response:**

```json
{
  "transfers": [
    {
      "blockNum": "0xc30e2c",
      "hash": "0x1234...5678",
      "from": "0xabcd...ef12",
      "to": "0x1234...5678",
      "value": 1.5,
      "asset": "ETH",
      "category": "external"
    }
  ]
}
```

### Get Token Metadata

Retrieves metadata for a given token contract.

**Endpoint:** `/v2/{apiKey}/getTokenMetadata`

**Method:** GET

**Query Parameters:**

- `contractAddress`: The token contract address

**Response:**

```json
{
  "name": "Wrapped Ether",
  "symbol": "WETH",
  "decimals": 18,
  "logo": "https://example.com/weth.png"
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

Rate limits vary by plan:

- **Free Tier**: 300 requests per minute
- **Growth Tier**: 1,000 requests per minute
- **Enterprise Tier**: Custom limits

## Webhooks

Alchemy supports webhooks for real-time notifications of blockchain events.

**Webhook Configuration Endpoint:** `/v2/{apiKey}/webhooks`

**Method:** POST

**Request Body:**

```json
{
  "url": "https://your-app.com/webhooks/alchemy",
  "type": "ADDRESS_ACTIVITY",
  "addresses": ["0x1234...5678"]
}
```

**Webhook Payload Example:**

```json
{
  "event": "ADDRESS_ACTIVITY",
  "address": "0x1234...5678",
  "transaction": {
    "hash": "0xabcd...ef12",
    "blockNumber": "0xc30e2c",
    "value": "0x1a055690d9db80000"
  }
}
```

## SDK

Alchemy provides a JavaScript SDK for easier integration:

```javascript
import { Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: 'YOUR_API_KEY',
  network: Network.ETH_MAINNET
};

const alchemy = new Alchemy(settings);

// Get token balances
const balances = await alchemy.core.getTokenBalances('0x1234...5678');

// Get asset transfers
const transfers = await alchemy.core.getAssetTransfers({
  fromAddress: '0x1234...5678',
  category: ['external', 'internal', 'erc20', 'erc721', 'erc1155']
});

// Get token metadata
const metadata = await alchemy.core.getTokenMetadata('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
```

## Best Practices

1. **Caching**: Cache token balances and metadata to minimize API calls
2. **Batch Requests**: Use batch requests to fetch multiple pieces of data in a single call
3. **Error Handling**: Implement proper error handling for all API calls
4. **Webhooks**: Use webhooks for real-time updates instead of polling
5. **Rate Limiting**: Respect rate limits and implement backoff strategies

## Additional Resources

- [Alchemy Documentation](https://docs.alchemy.com/alchemy/)
- [Alchemy Dashboard](https://dashboard.alchemyapi.io/)
- [Alchemy Discord](https://discord.gg/alchemyplatform)

