/**
 * Yield Rebalancing Service
 * 
 * Service for optimizing yield by rebalancing assets across different vaults.
 */
import lightchainService from './lightchainService';
import openaiService from './openaiService';
import supabaseService from './supabaseService';

/**
 * Service for yield rebalancing
 */
const yieldRebalancingService = {
  /**
   * Get yield optimization recommendations
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @returns {Promise} - The yield optimization recommendations
   */
  getYieldOptimizationRecommendations: async (collateralAccounts) => {
    try {
      // Get available yield aggregators
      const yieldAggregators = await supabaseService.getYieldAggregators();
      
      // Use OpenAI to get recommendations
      const aiRecommendations = await openaiService.getYieldOptimizationRecommendations(collateralAccounts);
      
      // Combine AI recommendations with available yield aggregators
      const recommendations = collateralAccounts.map(account => {
        // Find the best yield aggregator for this asset type
        const bestAggregator = yieldAggregators
          .filter(agg => agg.protocol.toLowerCase().includes(account.assetType.toLowerCase()) || 
                         agg.name.toLowerCase().includes(account.assetType.toLowerCase()))
          .sort((a, b) => b.currentApy - a.currentApy)[0];
        
        if (bestAggregator && bestAggregator.currentApy > account.yieldRate) {
          return {
            accountId: account.accountId,
            assetType: account.assetType,
            currentYield: account.yieldRate,
            recommendedAggregator: bestAggregator.name,
            potentialYield: bestAggregator.currentApy,
            yieldIncrease: bestAggregator.currentApy - account.yieldRate,
            riskLevel: bestAggregator.riskLevel,
            aggregatorId: bestAggregator.aggregatorId,
          };
        }
        
        return {
          accountId: account.accountId,
          assetType: account.assetType,
          currentYield: account.yieldRate,
          recommendedAggregator: 'Current position',
          potentialYield: account.yieldRate,
          yieldIncrease: 0,
          riskLevel: 'low',
          aggregatorId: null,
        };
      });
      
      return {
        recommendations,
        aiInsights: aiRecommendations.recommendations,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting yield optimization recommendations:', error);
      // Fall back to mock recommendations
      return yieldRebalancingService.mockGetYieldOptimizationRecommendations(collateralAccounts);
    }
  },
  
  /**
   * Rebalance yield for an account
   * @param {string} accountId - The account ID to rebalance
   * @param {string} targetAggregatorId - The target yield aggregator ID
   * @returns {Promise} - The rebalance operation result
   */
  rebalanceYield: async (accountId, targetAggregatorId) => {
    try {
      // Get the account and target aggregator
      const accounts = await supabaseService.getCollateralAccounts('current_user');
      const account = accounts.find(acc => acc.accountId === accountId);
      
      const aggregators = await supabaseService.getYieldAggregators();
      const targetAggregator = aggregators.find(agg => agg.aggregatorId === targetAggregatorId);
      
      if (!account || !targetAggregator) {
        throw new Error('Account or target aggregator not found');
      }
      
      // In a real implementation, this would involve:
      // 1. Unstaking from current position
      // 2. Approving the new protocol
      // 3. Staking in the new protocol
      // For now, we'll simulate this process
      
      // Create a rebalance operation record
      const rebalanceOperation = {
        operationId: `op_${Date.now()}`,
        userId: account.userId,
        sourceAccountId: accountId,
        targetVaultId: targetAggregatorId,
        amount: account.amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        expectedApyIncrease: targetAggregator.currentApy - account.yieldRate,
      };
      
      // Simulate the rebalancing process
      // In a real implementation, this would be an async process that updates the status
      setTimeout(() => {
        rebalanceOperation.status = 'completed';
        
        // Update the account with the new yield rate
        account.yieldRate = targetAggregator.currentApy;
        account.lastYieldUpdate = new Date().toISOString();
        
        // In a real implementation, this would update the database
      }, 3000);
      
      return {
        operation: rebalanceOperation,
        account,
        targetAggregator,
      };
    } catch (error) {
      console.error('Error rebalancing yield:', error);
      throw error;
    }
  },
  
  /**
   * Get available yield vaults
   * @param {string} assetType - The asset type to get vaults for
   * @returns {Promise} - The available yield vaults
   */
  getAvailableYieldVaults: async (assetType) => {
    try {
      // Get all yield aggregators
      const aggregators = await supabaseService.getYieldAggregators();
      
      // Filter by asset type if provided
      const filteredAggregators = assetType
        ? aggregators.filter(agg => 
            agg.protocol.toLowerCase().includes(assetType.toLowerCase()) || 
            agg.name.toLowerCase().includes(assetType.toLowerCase()))
        : aggregators;
      
      // Convert to yield vaults format
      const vaults = filteredAggregators.map(agg => ({
        vaultId: agg.aggregatorId,
        name: agg.name,
        protocol: agg.protocol,
        asset: assetType || 'Multiple',
        apy: agg.currentApy,
        riskLevel: agg.riskLevel,
        description: agg.description,
      }));
      
      return vaults;
    } catch (error) {
      console.error('Error getting available yield vaults:', error);
      // Fall back to mock vaults
      return yieldRebalancingService.mockGetAvailableYieldVaults(assetType);
    }
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting yield optimization recommendations without calling the actual APIs
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @returns {Promise} - A mock yield optimization recommendations response
   */
  mockGetYieldOptimizationRecommendations: async (collateralAccounts) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recommendations = collateralAccounts.map(account => {
      if (account.assetType === 'ETH') {
        return {
          accountId: account.accountId,
          assetType: account.assetType,
          currentYield: account.yieldRate,
          recommendedAggregator: 'Lido',
          potentialYield: 5.2,
          yieldIncrease: 5.2 - account.yieldRate,
          riskLevel: 'low',
          aggregatorId: 'agg_1',
        };
      } else if (account.assetType === 'stETH') {
        return {
          accountId: account.accountId,
          assetType: account.assetType,
          currentYield: account.yieldRate,
          recommendedAggregator: 'Current position',
          potentialYield: account.yieldRate,
          yieldIncrease: 0,
          riskLevel: 'low',
          aggregatorId: null,
        };
      } else if (account.assetType === 'USDC') {
        return {
          accountId: account.accountId,
          assetType: account.assetType,
          currentYield: account.yieldRate,
          recommendedAggregator: 'Aave',
          potentialYield: 4.5,
          yieldIncrease: 4.5 - account.yieldRate,
          riskLevel: 'medium',
          aggregatorId: 'agg_2',
        };
      }
      
      return {
        accountId: account.accountId,
        assetType: account.assetType,
        currentYield: account.yieldRate,
        recommendedAggregator: 'Current position',
        potentialYield: account.yieldRate,
        yieldIncrease: 0,
        riskLevel: 'low',
        aggregatorId: null,
      };
    });
    
    return {
      recommendations,
      aiInsights: 'Based on current market conditions, consider moving your ETH to Lido for higher staking rewards and your USDC to Aave for better lending rates. Your stETH position is already optimized.',
      timestamp: new Date().toISOString(),
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting available yield vaults without calling the actual APIs
   * @param {string} assetType - The asset type to get vaults for
   * @returns {Promise} - A mock available yield vaults response
   */
  mockGetAvailableYieldVaults: async (assetType) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allVaults = [
      {
        vaultId: 'vault_1',
        name: 'Lido Staking',
        protocol: 'Lido',
        asset: 'ETH',
        apy: 5.2,
        tvl: 12500000000, // $12.5B
        riskLevel: 'low',
        description: 'Liquid staking solution for ETH',
      },
      {
        vaultId: 'vault_2',
        name: 'Rocket Pool',
        protocol: 'Rocket Pool',
        asset: 'ETH',
        apy: 4.8,
        tvl: 2800000000, // $2.8B
        riskLevel: 'low',
        description: 'Decentralized ETH staking protocol',
      },
      {
        vaultId: 'vault_3',
        name: 'Aave USDC',
        protocol: 'Aave',
        asset: 'USDC',
        apy: 4.5,
        tvl: 3200000000, // $3.2B
        riskLevel: 'medium',
        description: 'USDC lending on Aave',
      },
      {
        vaultId: 'vault_4',
        name: 'Compound USDC',
        protocol: 'Compound',
        asset: 'USDC',
        apy: 3.8,
        tvl: 2100000000, // $2.1B
        riskLevel: 'medium',
        description: 'USDC lending on Compound',
      },
      {
        vaultId: 'vault_5',
        name: 'Curve stETH/ETH',
        protocol: 'Curve',
        asset: 'stETH',
        apy: 3.5,
        tvl: 1800000000, // $1.8B
        riskLevel: 'medium',
        description: 'stETH/ETH liquidity pool on Curve',
      },
    ];
    
    // Filter by asset type if provided
    if (assetType) {
      return allVaults.filter(vault => vault.asset === assetType);
    }
    
    return allVaults;
  },
};

export default yieldRebalancingService;

