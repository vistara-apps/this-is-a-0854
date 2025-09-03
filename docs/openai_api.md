# OpenAI API Documentation

## Overview

The OpenAI API provides AI-powered features for the LighterYield application, including yield optimization recommendations, trading insights, and user support.

## Base URL

```
https://api.openai.com
```

## Authentication

All requests to the OpenAI API require authentication using a Bearer token:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Chat Completions

Generates AI responses based on a conversation.

**Endpoint:** `/v1/chat/completions`

**Method:** POST

**Request Body:**

```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are a DeFi yield optimization assistant."
    },
    {
      "role": "user",
      "content": "What are your recommendations for optimizing my ETH yield?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Response:**

```json
{
  "id": "chatcmpl-1234567890",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "gpt-4",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Based on current market conditions, I recommend staking your ETH with Lido for a 5.2% APY. This provides a good balance of yield and security. Alternatively, you could consider..."
      },
      "finish_reason": "stop",
      "index": 0
    }
  ],
  "usage": {
    "prompt_tokens": 57,
    "completion_tokens": 120,
    "total_tokens": 177
  }
}
```

## Use Cases in LighterYield

### Yield Optimization Recommendations

The OpenAI API is used to provide personalized yield optimization recommendations based on the user's collateral accounts and current market conditions.

**Example System Prompt:**

```
You are a DeFi yield optimization assistant. Provide recommendations for optimizing yield based on the user's collateral accounts.
```

**Example User Message:**

```
Here are my collateral accounts:
[
  {
    "assetType": "ETH",
    "amount": 12.5,
    "yieldRate": 4.2
  },
  {
    "assetType": "stETH",
    "amount": 8.3,
    "yieldRate": 5.1
  },
  {
    "assetType": "USDC",
    "amount": 15000,
    "yieldRate": 3.8
  }
]
What are your recommendations for optimizing my yield?
```

### Trading Insights

The OpenAI API is used to provide trading insights based on current market data and the user's positions.

**Example System Prompt:**

```
You are a DeFi trading assistant. Provide insights and recommendations based on current market data and the user's positions.
```

**Example User Message:**

```
Here is the current market data:
{
  "assets": [
    { "symbol": "BTC", "price": 50000, "change24h": 2.5 },
    { "symbol": "ETH", "price": 2500, "change24h": 3.2 },
    { "symbol": "SOL", "price": 120, "change24h": 5.1 }
  ],
  "trends": {
    "btcDominance": 45.2,
    "totalMarketCap": 2100000000000,
    "fearGreedIndex": 65
  }
}
And here are my positions:
[]
What insights can you provide?
```

### User Support

The OpenAI API is used to provide conversational AI for user support.

**Example System Prompt:**

```
You are a helpful assistant for LighterYield, a DeFi application that allows users to manage yield from L1 collateral and access margin for trading without moving their assets, leveraging zk-proofs.
```

**Example User Message:**

```
How do I generate a zk-proof for my ETH collateral?
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

- **Free Tier**: 3 requests per minute
- **Paid Tier**: Varies by plan, typically 60+ requests per minute

## SDK

OpenAI provides a JavaScript SDK for easier integration:

```javascript
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY'
});

// Generate a chat completion
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: 'You are a DeFi yield optimization assistant.' },
    { role: 'user', content: 'What are your recommendations for optimizing my ETH yield?' }
  ],
  temperature: 0.7,
  max_tokens: 1000
});

console.log(completion.choices[0].message.content);
```

## Best Practices

1. **System Messages**: Use clear system messages to define the AI's role and constraints
2. **Temperature**: Use lower temperature (0.3-0.5) for more focused, deterministic responses
3. **Token Management**: Be mindful of token usage to control costs
4. **Error Handling**: Implement proper error handling and fallbacks
5. **Caching**: Cache responses where appropriate to minimize API calls
6. **Content Filtering**: Implement content filtering to ensure appropriate responses

## Additional Resources

- [OpenAI Documentation](https://platform.openai.com/docs/api-reference)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)
- [OpenAI Community Forum](https://community.openai.com/)

