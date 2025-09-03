# LighterYield Data Flow

## Overview

This document describes the data flow within the LighterYield application, detailing how data moves between components, services, and external APIs.

## High-Level Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Interface │────▶│  Context API    │────▶│  Service Layer  │
│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │                 │
                                               │  External APIs  │
                                               │                 │
                                               └─────────────────┘
                                                        │
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │                 │
                                               │  Data Storage   │
                                               │                 │
                                               └─────────────────┘
```

## Detailed Data Flow

### User Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  User       │────▶│  Wallet     │────▶│  User       │────▶│  Supabase   │
│  Interface  │     │  Connection │     │  Context    │     │  Auth       │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. User clicks "Connect Wallet" in the UI
2. RainbowKit opens wallet connection modal
3. User selects wallet and approves connection
4. Wallet address is passed to UserContext
5. UserContext checks if user exists in Supabase
6. If user exists, user data is loaded
7. If user doesn't exist, a new user is created
8. User authentication state is updated in UserContext
9. UI components are updated based on authentication state

### Collateral Scanning Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Collateral │────▶│  Alchemy    │────▶│  Collateral │────▶│  Supabase   │
│  Scanner    │     │  Service    │     │  Context    │     │  Database   │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. User initiates collateral scanning in the UI
2. CollateralScanner component calls alchemyService
3. alchemyService fetches token balances from Alchemy API
4. Token balances are processed and formatted
5. Collateral accounts are created and stored in CollateralContext
6. CollateralContext stores the accounts in Supabase
7. UI components are updated with the new collateral data

### Yield Aggregation Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Yield      │────▶│  Yield      │────▶│  Collateral │────▶│  Supabase   │
│  Dashboard  │     │  Service    │     │  Context    │     │  Database   │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. YieldDashboard component loads
2. YieldDashboard fetches collateral accounts from CollateralContext
3. YieldDashboard displays yield information for each account
4. User can view yield performance and statistics
5. Yield data is periodically updated via yieldRebalancingService
6. Updated yield data is stored in CollateralContext
7. CollateralContext updates the data in Supabase
8. UI components are updated with the new yield data

### Yield Rebalancing Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Yield      │────▶│  Yield      │────▶│  OpenAI     │────▶│  Yield      │
│  Rebalancer │     │  Rebalancing│     │  Service    │     │  Aggregators│
│             │◀────│  Service    │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │
                          │
                          ▼
                    ┌─────────────┐     ┌─────────────┐
                    │             │     │             │
                    │  Collateral │────▶│  Supabase   │
                    │  Context    │     │  Database   │
                    │             │◀────│             │
                    └─────────────┘     └─────────────┘
```

1. User views YieldRebalancer component
2. YieldRebalancer fetches collateral accounts from CollateralContext
3. YieldRebalancer calls yieldRebalancingService for recommendations
4. yieldRebalancingService fetches available yield aggregators
5. yieldRebalancingService calls openaiService for AI-powered recommendations
6. Recommendations are displayed to the user
7. User selects a recommendation to execute
8. yieldRebalancingService executes the rebalancing operation
9. Updated collateral account is stored in CollateralContext
10. CollateralContext updates the data in Supabase
11. UI components are updated with the new collateral data

### zk-Proof Generation Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Proof      │────▶│  Proof      │────▶│  Lightchain │────▶│  Collateral │
│  Manager    │     │  Service    │     │  Service    │     │  Context    │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                                                                  │
                                                                  ▼
                                                            ┌─────────────┐
                                                            │             │
                                                            │  Supabase   │
                                                            │  Database   │
                                                            │             │
                                                            └─────────────┘
```

1. User selects a collateral account in ProofManager
2. User clicks "Generate Proof"
3. ProofManager calls proofService.generateProof()
4. proofService calls lightchainService to generate the proof
5. lightchainService makes API call to Lightchain AI
6. Proof is generated and returned
7. Proof is stored in CollateralContext
8. CollateralContext stores the proof in Supabase
9. UI components are updated with the new proof data

### Proof Verification Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Proof      │────▶│  Proof      │────▶│  Lightchain │────▶│  Collateral │
│  Verifier   │     │  Service    │     │  Service    │     │  Context    │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                                                                  │
                                                                  ▼
                                                            ┌─────────────┐
                                                            │             │
                                                            │  Supabase   │
                                                            │  Database   │
                                                            │             │
                                                            └─────────────┘
```

1. User views a proof in ProofVerifier
2. User clicks "Verify Proof"
3. ProofVerifier calls proofService.verifyProof()
4. proofService calls lightchainService to verify the proof
5. lightchainService makes API call to Lightchain AI
6. Verification result is returned
7. Proof status is updated in CollateralContext
8. CollateralContext updates the proof in Supabase
9. UI components are updated with the new proof status

### Margin Calculation Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Margin     │────▶│  Margin     │────▶│  Collateral │────▶│  Supabase   │
│  Dashboard  │     │  Service    │     │  Context    │     │  Database   │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. MarginDashboard component loads
2. MarginDashboard fetches collateral accounts and proofs from CollateralContext
3. MarginDashboard calls marginService.calculateAvailableMargin()
4. marginService calculates available margin based on verified proofs
5. Available margin is displayed to the user
6. Margin data is periodically updated
7. Updated margin data is stored in CollateralContext
8. UI components are updated with the new margin data

### Trading Preparation Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Trading    │────▶│  Margin     │────▶│  OpenAI     │────▶│  Collateral │
│  Preparation│     │  Service    │     │  Service    │     │  Context    │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │
                          │
                          ▼
                    ┌─────────────┐     ┌─────────────┐
                    │             │     │             │
                    │  Lightchain │────▶│  Supabase   │
                    │  Service    │     │  Database   │
                    │             │◀────│             │
                    └─────────────┘     └─────────────┘
```

1. TradingPreparation component loads
2. TradingPreparation fetches collateral accounts and proofs from CollateralContext
3. TradingPreparation calls marginService.calculateAvailableMargin()
4. TradingPreparation calls marginService.getTradingOpportunities()
5. marginService calls openaiService for AI-powered trading insights
6. Trading opportunities are displayed to the user
7. User selects a trading opportunity
8. TradingPreparation calls marginService.executeTrade()
9. marginService calls lightchainService to initiate the trade
10. Trade is executed and recorded
11. Trade data is stored in Supabase
12. UI components are updated with the new trade data

### Subscription Management Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Subscription│────▶│  Subscription│────▶│  Payment    │────▶│  User       │
│  Manager    │     │  Service    │     │  Gateway    │     │  Context    │
│             │◀────│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                  │
                                                                  │
                                                                  ▼
                                                            ┌─────────────┐
                                                            │             │
                                                            │  Supabase   │
                                                            │  Database   │
                                                            │             │
                                                            └─────────────┘
```

1. User views SubscriptionManager component
2. SubscriptionManager fetches subscription data from UserContext
3. User selects a subscription tier
4. User clicks "Upgrade" or "Downgrade"
5. SubscriptionManager calls subscriptionService.upgradeSubscription()
6. subscriptionService processes the payment via payment gateway
7. Subscription is updated in UserContext
8. UserContext updates the subscription in Supabase
9. UI components are updated with the new subscription data

## Data Storage

### Supabase Database

LighterYield uses Supabase for data storage with the following tables:

1. **users**: Stores user information
2. **collateral_accounts**: Stores collateral account information
3. **proofs**: Stores zk-proof information
4. **trades**: Stores trade information
5. **yield_aggregators**: Stores yield aggregator information
6. **subscriptions**: Stores subscription information

### Local Storage

LighterYield uses local storage for:

1. **Authentication Tokens**: Stores JWT tokens for authentication
2. **User Preferences**: Stores user preferences like theme, language, etc.
3. **Cache**: Caches API responses for better performance

## Real-time Updates

LighterYield uses Supabase's real-time functionality for:

1. **Collateral Updates**: Real-time updates to collateral accounts
2. **Proof Status Updates**: Real-time updates to proof verification status
3. **Trade Updates**: Real-time updates to trade status
4. **Yield Updates**: Real-time updates to yield rates and accrued yield

## Error Handling

LighterYield implements comprehensive error handling:

1. **API Errors**: Handled at the service layer with appropriate fallbacks
2. **Network Errors**: Handled with retry mechanisms and offline support
3. **Validation Errors**: Handled with client-side validation and error messages
4. **Authentication Errors**: Handled with automatic token refresh and re-authentication
5. **Database Errors**: Handled with appropriate error messages and fallbacks

## Caching Strategy

LighterYield implements a caching strategy to improve performance:

1. **API Responses**: Cached to reduce network requests
2. **Collateral Data**: Cached to reduce database queries
3. **Yield Rates**: Cached to reduce API calls
4. **User Data**: Cached to reduce authentication requests
5. **Static Data**: Cached to reduce server load

## Data Security

LighterYield implements several data security measures:

1. **Encryption**: Sensitive data is encrypted at rest and in transit
2. **Authentication**: Secure authentication via Supabase Auth
3. **Authorization**: Row-level security policies in Supabase
4. **Input Validation**: Thorough validation of all user inputs
5. **API Security**: API keys and tokens stored securely
6. **Error Handling**: Proper error handling to prevent information leakage

