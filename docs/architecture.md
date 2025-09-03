# LighterYield Architecture

## Overview

LighterYield is a web application that enables DeFi users to manage yield from L1 collateral and access margin for trading without moving their assets, leveraging zk-proofs. This document outlines the architecture of the application.

## System Architecture

LighterYield follows a modern frontend-centric architecture with serverless backend services. The application is built using React and integrates with several external APIs and services.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       Client Application                        │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │             │   │             │   │                     │   │
│  │  React UI   │◀─▶│  Context    │◀─▶│  Service Layer      │   │
│  │  Components │   │  Providers  │   │                     │   │
│  │             │   │             │   │                     │   │
│  └─────────────┘   └─────────────┘   └─────────────────────┘   │
│                                                │                │
└────────────────────────────────────────────────┼────────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       External Services                         │
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────┐ │
│  │             │   │             │   │             │   │     │ │
│  │ Lightchain  │   │  Alchemy    │   │  OpenAI     │   │ Web3│ │
│  │ AI API      │   │  API        │   │  API        │   │ APIs│ │
│  │             │   │             │   │             │   │     │ │
│  └─────────────┘   └─────────────┘   └─────────────┘   └─────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       Data Storage                              │
│                                                                 │
│  ┌─────────────────────────┐   ┌─────────────────────────────┐ │
│  │                         │   │                             │ │
│  │  Supabase Database      │   │  Blockchain (L1 Collateral) │ │
│  │                         │   │                             │ │
│  └─────────────────────────┘   └─────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

The frontend is built using React with a component-based architecture. The application uses the Context API for state management and a service layer for API interactions.

### Component Structure

```
src/
├── components/               # UI components
│   ├── CollateralManager/    # Collateral management components
│   ├── DashboardLayout/      # Layout components
│   ├── MarginDashboard/      # Margin trading components
│   ├── ProofManager/         # zk-proof management components
│   ├── YieldDashboard/       # Yield management components
│   └── common/               # Common UI components
├── contexts/                 # Context providers
│   ├── CollateralContext.jsx # Collateral state management
│   └── UserContext.jsx       # User state management
├── hooks/                    # Custom hooks
│   └── usePaymentContext.js  # Payment processing hook
├── services/                 # API service layer
│   ├── alchemyService.js     # Alchemy API service
│   ├── api.js                # Base API service
│   ├── lightchainService.js  # Lightchain AI API service
│   ├── marginService.js      # Margin trading service
│   ├── openaiService.js      # OpenAI API service
│   ├── proofService.js       # zk-proof service
│   ├── subscriptionService.js # Subscription management service
│   ├── supabaseService.js    # Supabase service
│   └── yieldRebalancingService.js # Yield rebalancing service
├── types/                    # TypeScript type definitions
│   └── index.ts              # Type definitions
├── utils/                    # Utility functions
│   ├── formatting.js         # Formatting utilities
│   └── validation.js         # Validation utilities
├── App.jsx                   # Main application component
└── main.jsx                  # Application entry point
```

### State Management

LighterYield uses the Context API for state management. The application has two main contexts:

1. **UserContext**: Manages user authentication, profile, and subscription state
2. **CollateralContext**: Manages collateral accounts, proofs, and yield data

### Service Layer

The service layer abstracts the interaction with external APIs and provides a clean interface for the components to use. Each service is responsible for a specific domain:

1. **alchemyService**: Interacts with the Alchemy API for blockchain data
2. **lightchainService**: Interacts with the Lightchain AI API for zk-proof generation and verification
3. **openaiService**: Interacts with the OpenAI API for AI-powered insights
4. **supabaseService**: Interacts with Supabase for data storage and authentication
5. **marginService**: Manages margin trading functionality
6. **proofService**: Manages zk-proof generation and verification
7. **subscriptionService**: Manages subscription tiers and payments
8. **yieldRebalancingService**: Manages yield optimization and rebalancing

## Backend Architecture

LighterYield uses Supabase as its primary backend service, providing database storage, authentication, and real-time updates.

### Database Schema

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│     Users       │───┐   │  Collateral     │       │     Proofs      │
│                 │   │   │  Accounts       │       │                 │
└─────────────────┘   │   └─────────────────┘       └─────────────────┘
                      │           │                         │
                      │           │                         │
                      │           ▼                         │
                      │   ┌─────────────────┐               │
                      └──▶│                 │◀──────────────┘
                          │     Trades      │
                          │                 │
                          └─────────────────┘
                                  │
                                  │
                                  ▼
                          ┌─────────────────┐
                          │                 │
                          │  Yield          │
                          │  Aggregators    │
                          │                 │
                          └─────────────────┘
```

### External API Integration

LighterYield integrates with several external APIs:

1. **Lightchain AI API**: For zk-proof generation and verification
2. **Alchemy API**: For blockchain data and asset information
3. **OpenAI API**: For AI-powered insights and recommendations
4. **Web3 APIs**: For blockchain interactions

## Deployment Architecture

LighterYield is deployed using a modern CI/CD pipeline with the following components:

1. **GitHub**: Source code repository and CI/CD pipeline
2. **Vercel**: Frontend hosting and serverless functions
3. **Supabase**: Database and authentication
4. **Monitoring**: Application monitoring and error tracking

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│    GitHub       │──────▶│    Vercel       │──────▶│    Production   │
│    Repository   │       │    CI/CD        │       │    Environment  │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                            │
                                                            │
                                                            ▼
                                                    ┌─────────────────┐
                                                    │                 │
                                                    │    Monitoring   │
                                                    │    & Logging    │
                                                    │                 │
                                                    └─────────────────┘
```

## Security Architecture

LighterYield implements several security measures:

1. **Authentication**: Secure user authentication via Supabase Auth
2. **Authorization**: Row-level security policies in Supabase
3. **Data Encryption**: Sensitive data encrypted at rest
4. **API Security**: API keys and tokens stored securely
5. **Input Validation**: Thorough validation of all user inputs
6. **Error Handling**: Proper error handling to prevent information leakage
7. **HTTPS**: All communications over HTTPS
8. **CORS**: Proper CORS configuration to prevent unauthorized access

## Performance Architecture

LighterYield implements several performance optimizations:

1. **Code Splitting**: Lazy loading of components for faster initial load
2. **Caching**: Caching of API responses to reduce network requests
3. **Memoization**: Memoization of expensive calculations
4. **Virtualization**: Virtualization of long lists for better performance
5. **Image Optimization**: Optimization of images for faster loading
6. **Bundle Size**: Minimization of bundle size through tree shaking and code splitting

## Scalability Considerations

LighterYield is designed to scale with increasing user load:

1. **Serverless Architecture**: Automatic scaling of serverless functions
2. **Database Scaling**: Supabase provides automatic scaling of database resources
3. **CDN**: Use of CDN for static assets to reduce server load
4. **Caching**: Extensive caching to reduce API calls
5. **Asynchronous Processing**: Asynchronous processing of long-running tasks

## Future Architecture Enhancements

1. **Microservices**: Migration to a microservices architecture for better scalability
2. **GraphQL**: Implementation of GraphQL for more efficient data fetching
3. **Server-Side Rendering**: Implementation of server-side rendering for better SEO and initial load performance
4. **Edge Computing**: Deployment of critical functions to edge locations for lower latency
5. **Multi-Region Deployment**: Deployment to multiple regions for better global performance

