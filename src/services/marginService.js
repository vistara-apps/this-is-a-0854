/**
 * Margin Service
 * 
 * Service for managing margin positions and trading.
 */
import lightchainService from './lightchainService';
import alchemyService from './alchemyService';
import openaiService from './openaiService';

/**
 * Service for margin management
 */
const marginService = {
  /**
   * Calculate available margin for a user
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @param {Array} proofs - The user's verified proofs
   * @returns {Promise} - The available margin calculation
   */
  calculateAvailableMargin: async (collateralAccounts, proofs) => {
    try {
      // Filter for verified proofs only
      const verifiedProofs = proofs.filter(proof => proof.verificationStatus === 'verified');
      
      // Calculate available margin for each verified proof
      const marginPositions = verifiedProofs.map(proof => {
        // Find the corresponding collateral account
        const account = collateralAccounts.find(acc => 
          acc.assetType === proof.assetType && 
          acc.address === proof.collateralAddress
        );
        
        if (!account) return null;
        
        // Calculate margin based on collateral value and a loan-to-value ratio
        // For example, 70% LTV for ETH, 65% for stETH, 80% for stablecoins
        let ltvRatio = 0.7; // Default 70% LTV
        
        if (account.assetType === 'stETH') {
          ltvRatio = 0.65;
        } else if (account.assetType === 'USDC' || account.assetType === 'USDT' || account.assetType === 'DAI') {
          ltvRatio = 0.8;
        }
        
        const availableMargin = account.currentValue * ltvRatio;
        
        return {
          positionId: `pos_${Date.now()}_${proof.proofId}`,
          userId: account.userId,
          collateralAccountId: account.accountId,
          proofId: proof.proofId,
          availableMargin,
          utilizationRate: 0, // No margin used yet
          liquidationThreshold: ltvRatio * 0.9, // 90% of LTV
          healthFactor: 1, // 1 = healthy, < 1 = at risk
          updatedAt: new Date().toISOString(),
        };
      }).filter(Boolean);
      
      // Calculate total available margin
      const totalAvailableMargin = marginPositions.reduce((sum, pos) => sum + pos.availableMargin, 0);
      
      return {
        marginPositions,
        totalAvailableMargin,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error calculating available margin:', error);
      // Fall back to mock calculation
      return marginService.mockCalculateAvailableMargin(collateralAccounts, proofs);
    }
  },
  
  /**
   * Get trading opportunities
   * @param {number} availableMargin - The user's available margin
   * @returns {Promise} - The trading opportunities
   */
  getTradingOpportunities: async (availableMargin) => {
    try {
      // In a real implementation, this would involve:
      // 1. Getting current market data
      // 2. Analyzing trends and patterns
      // 3. Using AI to identify opportunities
      // For now, we'll use OpenAI to generate mock opportunities
      
      const marketData = {
        assets: [
          { symbol: 'BTC', price: 50000, change24h: 2.5 },
          { symbol: 'ETH', price: 2500, change24h: 3.2 },
          { symbol: 'SOL', price: 120, change24h: 5.1 },
        ],
        trends: {
          btcDominance: 45.2,
          totalMarketCap: 2100000000000, // $2.1T
          fearGreedIndex: 65, // 0-100, higher = more greedy
        },
      };
      
      const userPositions = []; // No positions yet
      
      const insights = await openaiService.getTradingInsights(marketData, userPositions);
      
      // Generate opportunities based on insights and available margin
      const opportunities = [
        {
          asset: 'BTC',
          position: 'long',
          confidence: 'high',
          potentialReturn: 15.2,
          timeframe: '1-2 weeks',
          marginRequired: availableMargin * 0.4, // 40% of available margin
          reasoning: 'Strong technical breakout with increasing volume',
        },
        {
          asset: 'ETH',
          position: 'short',
          confidence: 'medium',
          potentialReturn: 8.7,
          timeframe: '3-5 days',
          marginRequired: availableMargin * 0.3, // 30% of available margin
          reasoning: 'Overbought on daily timeframe with divergence',
        },
      ];
      
      return {
        opportunities,
        marketData,
        insights: insights.insights,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting trading opportunities:', error);
      // Fall back to mock opportunities
      return marginService.mockGetTradingOpportunities(availableMargin);
    }
  },
  
  /**
   * Execute a trade
   * @param {Object} tradeData - Data about the trade
   * @param {string} tradeData.proofId - The ID of the proof to use
   * @param {string} tradeData.asset - The asset to trade
   * @param {string} tradeData.position - The position type (long/short)
   * @param {number} tradeData.amount - The amount to trade
   * @param {number} tradeData.leverage - The leverage to use
   * @returns {Promise} - The trade result
   */
  executeTrade: async (tradeData) => {
    try {
      // In a real implementation, this would involve:
      // 1. Verifying the proof is valid
      // 2. Checking available margin
      // 3. Executing the trade on a trading platform
      // 4. Recording the trade
      // For now, we'll simulate this process
      
      // Call Lightchain API to initiate the trade
      const tradeResult = await lightchainService.initiateMarginTrade(tradeData);
      
      return tradeResult;
    } catch (error) {
      console.error('Error executing trade:', error);
      throw error;
    }
  },
  
  /**
   * Get real-time margin data
   * @param {Array} marginPositions - The user's margin positions
   * @returns {Promise} - The real-time margin data
   */
  getRealTimeMarginData: async (marginPositions) => {
    try {
      // In a real implementation, this would involve:
      // 1. Getting current market prices
      // 2. Calculating current position values
      // 3. Updating health factors and liquidation risks
      // For now, we'll simulate this process
      
      // Generate mock price movements
      const priceMovements = {
        ETH: 1 + (Math.random() * 0.02 - 0.01), // ±1%
        BTC: 1 + (Math.random() * 0.02 - 0.01), // ±1%
        USDC: 1, // Stable
      };
      
      // Update margin positions with current data
      const updatedPositions = marginPositions.map(position => {
        // Find the asset type from the position
        const assetType = position.assetType || 'ETH'; // Default to ETH if not specified
        
        // Apply price movement to available margin
        const priceChange = priceMovements[assetType] || 1;
        const updatedMargin = position.availableMargin * priceChange;
        
        // Update health factor based on utilization and price change
        const healthFactor = position.utilizationRate > 0
          ? 1 - (position.utilizationRate / position.liquidationThreshold) * (1 / priceChange)
          : 1;
        
        return {
          ...position,
          availableMargin: updatedMargin,
          healthFactor,
          updatedAt: new Date().toISOString(),
        };
      });
      
      // Calculate total available margin
      const totalAvailableMargin = updatedPositions.reduce((sum, pos) => sum + pos.availableMargin, 0);
      
      return {
        marginPositions: updatedPositions,
        totalAvailableMargin,
        priceMovements,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting real-time margin data:', error);
      // Return the original positions if there's an error
      return {
        marginPositions,
        totalAvailableMargin: marginPositions.reduce((sum, pos) => sum + pos.availableMargin, 0),
        timestamp: new Date().toISOString(),
      };
    }
  },
  
  /**
   * Mock function for development/testing
   * Simulates calculating available margin without calling the actual APIs
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @param {Array} proofs - The user's verified proofs
   * @returns {Promise} - A mock available margin calculation response
   */
  mockCalculateAvailableMargin: async (collateralAccounts, proofs) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter for verified proofs only
    const verifiedProofs = proofs.filter(proof => proof.verificationStatus === 'verified');
    
    // Calculate available margin for each verified proof
    const marginPositions = verifiedProofs.map(proof => {
      // Find the corresponding collateral account
      const account = collateralAccounts.find(acc => 
        acc.assetType === proof.assetType && 
        acc.address === proof.collateralAddress
      );
      
      if (!account) return null;
      
      // Calculate margin based on collateral value and a loan-to-value ratio
      let ltvRatio = 0.7; // Default 70% LTV
      
      if (account.assetType === 'stETH') {
        ltvRatio = 0.65;
      } else if (account.assetType === 'USDC') {
        ltvRatio = 0.8;
      }
      
      const availableMargin = account.currentValue * ltvRatio;
      
      return {
        positionId: `pos_${Date.now()}_${proof.proofId}`,
        userId: account.userId,
        collateralAccountId: account.accountId,
        proofId: proof.proofId,
        availableMargin,
        utilizationRate: 0, // No margin used yet
        liquidationThreshold: ltvRatio * 0.9, // 90% of LTV
        healthFactor: 1, // 1 = healthy, < 1 = at risk
        updatedAt: new Date().toISOString(),
        assetType: account.assetType, // Add asset type for mock data
      };
    }).filter(Boolean);
    
    // Calculate total available margin
    const totalAvailableMargin = marginPositions.reduce((sum, pos) => sum + pos.availableMargin, 0);
    
    return {
      marginPositions,
      totalAvailableMargin,
      timestamp: new Date().toISOString(),
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting trading opportunities without calling the actual APIs
   * @param {number} availableMargin - The user's available margin
   * @returns {Promise} - A mock trading opportunities response
   */
  mockGetTradingOpportunities: async (availableMargin) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const marketData = {
      assets: [
        { symbol: 'BTC', price: 50000, change24h: 2.5 },
        { symbol: 'ETH', price: 2500, change24h: 3.2 },
        { symbol: 'SOL', price: 120, change24h: 5.1 },
      ],
      trends: {
        btcDominance: 45.2,
        totalMarketCap: 2100000000000, // $2.1T
        fearGreedIndex: 65, // 0-100, higher = more greedy
      },
    };
    
    const opportunities = [
      {
        asset: 'BTC',
        position: 'long',
        confidence: 'high',
        potentialReturn: 15.2,
        timeframe: '1-2 weeks',
        marginRequired: availableMargin * 0.4, // 40% of available margin
        reasoning: 'Strong technical breakout with increasing volume',
      },
      {
        asset: 'ETH',
        position: 'short',
        confidence: 'medium',
        potentialReturn: 8.7,
        timeframe: '3-5 days',
        marginRequired: availableMargin * 0.3, // 30% of available margin
        reasoning: 'Overbought on daily timeframe with divergence',
      },
    ];
    
    const insights = [
      {
        asset: 'BTC',
        sentiment: 'bullish',
        recommendation: 'Consider increasing BTC exposure with a portion of your available margin.',
        reasoning: 'Recent network activity and institutional inflows suggest positive momentum.',
      },
      {
        asset: 'ETH',
        sentiment: 'bearish',
        recommendation: 'Consider a short position on ETH with strict risk management.',
        reasoning: 'Technical indicators show overbought conditions with bearish divergence.',
      },
    ];
    
    return {
      opportunities,
      marketData,
      insights,
      timestamp: new Date().toISOString(),
    };
  },
};

export default marginService;

