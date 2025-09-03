# LighterYield API Documentation

This document provides comprehensive documentation for all API integrations used in the LighterYield application.

## Overview

LighterYield integrates with several external APIs to provide its core functionality:

1. **Lightchain AI API**: For zk-proof generation and verification
2. **Alchemy API**: For blockchain data and asset information
3. **OpenAI API**: For AI-powered insights and recommendations
4. **Supabase API**: For data storage and user management

## Authentication

Each API requires specific authentication methods:

- **Lightchain AI**: Bearer token authentication
- **Alchemy**: API key in URL path
- **OpenAI**: Bearer token authentication
- **Supabase**: API key and JWT authentication

## Error Handling

All API services implement consistent error handling:

1. **Request Errors**: Network issues, timeouts, etc.
2. **Authentication Errors**: Invalid or expired tokens
3. **Authorization Errors**: Insufficient permissions
4. **Resource Errors**: Requested resource not found
5. **Validation Errors**: Invalid request parameters
6. **Server Errors**: Internal server errors

Each service provides fallback mechanisms to ensure the application remains functional even when external APIs are unavailable.

## Rate Limiting

- **Lightchain AI**: 100 requests per minute
- **Alchemy**: Varies by plan (default: 300 requests per minute)
- **OpenAI**: 3 requests per minute for free tier, higher for paid tiers
- **Supabase**: Unlimited for most operations, with reasonable usage policies

## Detailed API Documentation

For detailed documentation on each API, please refer to the following documents:

- [Lightchain AI API Documentation](./lightchain_api.md)
- [Alchemy API Documentation](./alchemy_api.md)
- [OpenAI API Documentation](./openai_api.md)
- [Supabase API Documentation](./supabase_api.md)

## Service Architecture

LighterYield implements a service layer that abstracts the external API interactions:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  UI Components  │────▶│  Service Layer  │────▶│  External APIs  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Each service provides:

1. **Real API Methods**: For production use
2. **Mock Methods**: For development and testing
3. **Error Handling**: Consistent error handling and fallbacks
4. **Caching**: Where appropriate to minimize API calls

## Development Guidelines

When working with the API services:

1. Always use the service layer rather than calling APIs directly
2. Implement proper error handling for all API calls
3. Use mock methods during development to avoid hitting rate limits
4. Cache responses where appropriate to minimize API calls
5. Respect rate limits and implement backoff strategies

## Webhook Support

Some APIs provide webhook support for real-time updates:

- **Lightchain AI**: Proof verification status updates
- **Alchemy**: New block notifications and asset transfer events
- **Supabase**: Real-time database updates via subscriptions

## API Versioning

All API integrations specify version requirements to ensure compatibility:

- **Lightchain AI**: v1
- **Alchemy**: v2
- **OpenAI**: v1
- **Supabase**: v1

## Security Considerations

- All API keys and tokens are stored securely and never exposed to clients
- All API requests are made server-side where possible
- HTTPS is used for all API communications
- Sensitive data is encrypted before storage

