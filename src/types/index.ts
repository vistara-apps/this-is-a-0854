/**
 * LighterYield Data Models
 * 
 * This file contains TypeScript interfaces for all data models used in the application,
 * following the specifications from the PRD.
 */

/**
 * User entity representing a registered user in the system
 */
export interface User {
  userId: string;
  email: string;
  subscriptionTier: 'basic' | 'pro' | 'none';
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription information for a user
 */
export interface Subscription {
  tier: 'basic' | 'pro' | 'none';
  status: 'active' | 'inactive' | 'pending' | 'cancelled';
  expiresAt: string;
  features: string[];
}

/**
 * CollateralAccount entity representing a user's collateral on L1
 */
export interface CollateralAccount {
  accountId: string;
  userId: string;
  network: string;
  address: string;
  assetType: string;
  amount: number;
  yieldRate: number;
  yieldAccrued: number;
  lastYieldUpdate: string;
  currentValue?: number; // USD value of the collateral
}

/**
 * YieldAggregator entity representing a yield source
 */
export interface YieldAggregator {
  aggregatorId: string;
  name: string;
  apyEndpoint: string;
  currentApy?: number;
  description?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  minDeposit?: number;
  protocol?: string;
}

/**
 * Trade entity representing a margin trade made using collateral
 */
export interface Trade {
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

/**
 * Proof entity representing a zk-proof of collateral ownership
 */
export interface Proof {
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

/**
 * YieldVault entity representing a potential yield-generating vault
 */
export interface YieldVault {
  vaultId: string;
  name: string;
  protocol: string;
  asset: string;
  apy: number;
  tvl?: number; // Total Value Locked
  riskLevel: 'low' | 'medium' | 'high';
  description?: string;
}

/**
 * RebalanceOperation entity representing a yield rebalancing operation
 */
export interface RebalanceOperation {
  operationId: string;
  userId: string;
  sourceAccountId: string;
  targetVaultId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  expectedApyIncrease: number;
}

/**
 * MarginPosition entity representing available margin from collateral
 */
export interface MarginPosition {
  positionId: string;
  userId: string;
  collateralAccountId: string;
  proofId: string;
  availableMargin: number;
  utilizationRate: number;
  liquidationThreshold: number;
  healthFactor: number;
  updatedAt: string;
}

/**
 * API Response types for external services
 */

export interface LightchainProofResponse {
  proofId: string;
  proofHash: string;
  status: string;
  timestamp: string;
}

export interface AlchemyBalanceResponse {
  address: string;
  tokenBalances: Array<{
    contractAddress: string;
    tokenBalance: string;
    error?: string;
  }>;
}

export interface OpenAICompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

