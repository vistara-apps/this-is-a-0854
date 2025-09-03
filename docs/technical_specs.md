# LighterYield Technical Specifications

## Overview

LighterYield is a web application for DeFi users to manage yield from L1 collateral and access margin for trading without moving their assets, leveraging zk-proofs. This document provides comprehensive technical specifications for the application.

## Architecture

LighterYield follows a modern frontend architecture with the following components:

### Frontend

- **Framework**: React with Vite for fast development and optimized builds
- **State Management**: Context API for global state management
- **Styling**: Tailwind CSS for utility-first styling
- **Wallet Integration**: RainbowKit and wagmi for wallet connection and blockchain interactions
- **Data Fetching**: Axios for API requests, TanStack Query for data fetching and caching
- **Charts**: Recharts for data visualization

### Backend

- **Database**: Supabase for data storage and real-time updates
- **Authentication**: Supabase Auth for user authentication
- **API Integration**: 
  - Lightchain AI for zk-proof generation and verification
  - Alchemy for blockchain data and asset information
  - OpenAI for AI-powered insights and recommendations

### Deployment

- **Hosting**: Vercel for frontend hosting
- **CI/CD**: GitHub Actions for continuous integration and deployment
- **Monitoring**: Vercel Analytics for performance monitoring

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Interface │────▶│  Service Layer  │────▶│  External APIs  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Context API    │◀───▶│  Supabase DB    │◀───▶│  Blockchain     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. User interacts with the UI components
2. UI components dispatch actions to the Context API
3. Context API updates the global state and triggers service layer calls
4. Service layer makes API requests to external services and Supabase
5. External services process the requests and return responses
6. Service layer processes the responses and updates the Context API
7. Context API updates the UI components with the new state

## Component Structure

```
src/
├── components/
│   ├── CollateralManager.jsx
│   ├── CollateralScanner.jsx
│   ├── CollateralTable.jsx
│   ├── DashboardLayout.jsx
│   ├── Header.jsx
│   ├── MarginChart.jsx
│   ├── MarginDashboard.jsx
│   ├── OnboardingFlow.jsx
│   ├── ProofManager.jsx
│   ├── ProofStatusIndicator.jsx
│   ├── ProofVerifier.jsx
│   ├── Sidebar.jsx
│   ├── SubscriptionManager.jsx
│   ├── TradingPreparation.jsx
│   ├── WelcomeScreen.jsx
│   ├── YieldCard.jsx
│   ├── YieldDashboard.jsx
│   └── YieldRebalancer.jsx
├── contexts/
│   ├── CollateralContext.jsx
│   └── UserContext.jsx
├── hooks/
│   └── usePaymentContext.js
├── services/
│   ├── alchemyService.js
│   ├── api.js
│   ├── lightchainService.js
│   ├── marginService.js
│   ├── openaiService.js
│   ├── proofService.js
│   ├── subscriptionService.js
│   ├── supabaseService.js
│   └── yieldRebalancingService.js
├── types/
│   └── index.ts
├── App.jsx
└── main.jsx
```

## Data Models

### User

```typescript
interface User {
  userId: string;
  email: string;
  subscriptionTier: 'basic' | 'pro' | 'none';
  createdAt: string;
  updatedAt: string;
}
```

### Subscription

```typescript
interface Subscription {
  tier: 'basic' | 'pro' | 'none';
  status: 'active' | 'inactive' | 'pending' | 'cancelled';
  expiresAt: string;
  features: string[];
}
```

### CollateralAccount

```typescript
interface CollateralAccount {
  accountId: string;
  userId: string;
  network: string;
  address: string;
  assetType: string;
  amount: number;
  yieldRate: number;
  yieldAccrued: number;
  lastYieldUpdate: string;
  currentValue?: number;
}
```

### YieldAggregator

```typescript
interface YieldAggregator {
  aggregatorId: string;
  name: string;
  apyEndpoint: string;
  currentApy?: number;
  description?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  minDeposit?: number;
  protocol?: string;
}
```

### Trade

```typescript
interface Trade {
  tradeId: string;
  userId: string;
  collateralUsed: string;
  marginAccessProofId: string;
  entryPrice: number;
  exitPrice?: number;
  profitLoss?: number;
  timestamp: string;
  status: 'open' | 'closed' | 'liquidated';
  asset: string;
  position: 'long' | 'short';
  leverage?: number;
}
```

### Proof

```typescript
interface Proof {
  proofId: string;
  userId: string;
  collateralAddress: string;
  proofHash: string;
  generatedAt: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  collateralAmount?: number;
  assetType?: string;
  expiresAt?: string;
}
```

## API Integrations

### Lightchain AI

Used for zk-proof generation and verification.

**Key Endpoints:**
- `/api/v1/proofs/submit`: Generate a zk-proof
- `/api/v1/proofs/verify`: Verify a zk-proof
- `/api/v1/collateral/status`: Get collateral status
- `/api/v1/trade/margin`: Initiate a margin trade

### Alchemy

Used for blockchain data and asset information.

**Key Endpoints:**
- `/v2/{apiKey}/getTokenBalances`: Get token balances
- `/v2/{apiKey}/getAssetTransfers`: Get asset transfers
- `/v2/{apiKey}/getTokenMetadata`: Get token metadata

### OpenAI

Used for AI-powered insights and recommendations.

**Key Endpoints:**
- `/v1/chat/completions`: Generate AI responses

### Supabase

Used for data storage and user management.

**Key Endpoints:**
- `/rest/v1/{table}`: CRUD operations on database tables
- `/auth/v1/signup`: Create a new user
- `/auth/v1/token`: Sign in an existing user

## User Flows

### L1 Collateral Onboarding & Yield Tracking

1. User connects wallet (e.g., MetaMask)
2. User grants permission to view L1 collateral addresses
3. Application scans L1 addresses for specified yield-bearing assets (ETH, stETH, vault tokens)
4. Dashboard displays aggregated yield and current APYs
5. User can optionally configure yield rebalancing notification

### Margin Access & Trading Preparation

1. User selects 'Get Margin Access' for a specific collateral asset
2. Application prompts user to confirm collateral for zk-proof generation via Lightchain AI
3. User approves transaction (if any gas fees are involved for proof issuance)
4. Application displays proof generation status
5. Once verified, the 'Real-time Margin Monitoring' dashboard updates with available margin
6. User can now see their available margin to use for perps trading

## Security Considerations

- **Authentication**: Secure user authentication via Supabase Auth
- **Authorization**: Row-level security policies in Supabase
- **Data Encryption**: Sensitive data encrypted at rest
- **API Security**: API keys and tokens stored securely
- **Input Validation**: Thorough validation of all user inputs
- **Error Handling**: Proper error handling to prevent information leakage
- **HTTPS**: All communications over HTTPS
- **CORS**: Proper CORS configuration to prevent unauthorized access
- **Rate Limiting**: Rate limiting to prevent abuse
- **Audit Logging**: Logging of all security-relevant events

## Performance Considerations

- **Code Splitting**: Lazy loading of components for faster initial load
- **Caching**: Caching of API responses to reduce network requests
- **Memoization**: Memoization of expensive calculations
- **Virtualization**: Virtualization of long lists for better performance
- **Image Optimization**: Optimization of images for faster loading
- **Bundle Size**: Minimization of bundle size through tree shaking and code splitting
- **Server-Side Rendering**: Server-side rendering for better SEO and initial load performance
- **CDN**: Use of CDN for static assets

## Accessibility Considerations

- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader Support**: Proper ARIA attributes for screen reader support
- **Color Contrast**: Sufficient color contrast for readability
- **Focus Indicators**: Clear focus indicators for keyboard navigation
- **Alternative Text**: Alternative text for images
- **Semantic HTML**: Use of semantic HTML elements
- **Responsive Design**: Responsive design for all screen sizes
- **Font Size**: Adjustable font size for readability

## Browser Compatibility

- **Modern Browsers**: Full support for modern browsers (Chrome, Firefox, Safari, Edge)
- **Polyfills**: Polyfills for older browsers where necessary
- **Feature Detection**: Feature detection instead of browser detection
- **Graceful Degradation**: Graceful degradation for unsupported features

## Deployment Strategy

- **Continuous Integration**: Automated testing on every pull request
- **Continuous Deployment**: Automated deployment on merge to main branch
- **Environment Variables**: Environment-specific configuration via environment variables
- **Feature Flags**: Feature flags for gradual rollout of new features
- **Rollback Plan**: Plan for rolling back deployments if issues are detected
- **Monitoring**: Monitoring of application performance and errors
- **Alerting**: Alerting for critical issues

## Testing Strategy

- **Unit Tests**: Unit tests for individual components and functions
- **Integration Tests**: Integration tests for component interactions
- **End-to-End Tests**: End-to-end tests for critical user flows
- **Performance Tests**: Performance tests for critical operations
- **Security Tests**: Security tests for vulnerabilities
- **Accessibility Tests**: Accessibility tests for compliance
- **Cross-Browser Tests**: Cross-browser tests for compatibility
- **Mobile Tests**: Mobile tests for responsive design

## Future Enhancements

- **Mobile App**: Native mobile app for iOS and Android
- **Multi-Chain Support**: Support for additional blockchain networks
- **Advanced Analytics**: More advanced analytics and reporting
- **Social Features**: Social features for sharing strategies and insights
- **Integration with DEXs**: Direct integration with decentralized exchanges
- **Automated Trading**: Automated trading based on user-defined strategies
- **Portfolio Management**: Comprehensive portfolio management features
- **Tax Reporting**: Tax reporting and documentation

