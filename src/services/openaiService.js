/**
 * OpenAI Service
 * 
 * Service for interacting with the OpenAI API for AI-powered features.
 */
import apiService from './api';

// API endpoints
const ENDPOINTS = {
  CHAT_COMPLETIONS: '/v1/chat/completions',
};

// Base URL for OpenAI API
const BASE_URL = process.env.REACT_APP_OPENAI_API_URL || 'https://api.openai.com';

// OpenAI API key
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';

/**
 * Service for interacting with OpenAI API
 */
const openaiService = {
  /**
   * Get a chat completion from OpenAI
   * @param {Array} messages - The messages to send to OpenAI
   * @param {Object} options - Additional options
   * @param {string} options.model - The model to use (default: gpt-4)
   * @param {number} options.temperature - The temperature (default: 0.7)
   * @param {number} options.max_tokens - The maximum number of tokens (default: 1000)
   * @returns {Promise} - The chat completion response
   */
  getChatCompletion: async (messages, options = {}) => {
    try {
      const defaultOptions = {
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000,
      };
      
      const requestOptions = {
        ...defaultOptions,
        ...options,
        messages,
      };
      
      const headers = {
        'Authorization': `Bearer ${API_KEY}`,
      };
      
      const response = await apiService.post(
        `${BASE_URL}${ENDPOINTS.CHAT_COMPLETIONS}`,
        requestOptions,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting chat completion:', error);
      throw error;
    }
  },
  
  /**
   * Get yield optimization recommendations
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @returns {Promise} - The yield optimization recommendations
   */
  getYieldOptimizationRecommendations: async (collateralAccounts) => {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a DeFi yield optimization assistant. Provide recommendations for optimizing yield based on the user\'s collateral accounts.',
        },
        {
          role: 'user',
          content: `Here are my collateral accounts: ${JSON.stringify(collateralAccounts)}. What are your recommendations for optimizing my yield?`,
        },
      ];
      
      const response = await openaiService.getChatCompletion(messages, {
        temperature: 0.5, // Lower temperature for more focused recommendations
      });
      
      return {
        recommendations: response.choices[0].message.content,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting yield optimization recommendations:', error);
      // Fall back to mock recommendations if API call fails
      return openaiService.mockGetYieldOptimizationRecommendations(collateralAccounts);
    }
  },
  
  /**
   * Get trading insights
   * @param {Object} marketData - Current market data
   * @param {Array} userPositions - The user's current positions
   * @returns {Promise} - The trading insights
   */
  getTradingInsights: async (marketData, userPositions) => {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a DeFi trading assistant. Provide insights and recommendations based on current market data and the user\'s positions.',
        },
        {
          role: 'user',
          content: `Here is the current market data: ${JSON.stringify(marketData)}. And here are my positions: ${JSON.stringify(userPositions)}. What insights can you provide?`,
        },
      ];
      
      const response = await openaiService.getChatCompletion(messages, {
        temperature: 0.5, // Lower temperature for more focused insights
      });
      
      return {
        insights: response.choices[0].message.content,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting trading insights:', error);
      // Fall back to mock insights if API call fails
      return openaiService.mockGetTradingInsights(marketData, userPositions);
    }
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting yield optimization recommendations without calling the actual API
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @returns {Promise} - A mock yield optimization recommendations response
   */
  mockGetYieldOptimizationRecommendations: async (collateralAccounts) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate recommendations based on the collateral accounts
    const recommendations = [];
    
    collateralAccounts.forEach(account => {
      if (account.assetType === 'ETH') {
        recommendations.push({
          assetType: 'ETH',
          currentYield: account.yieldRate,
          recommendedAction: 'Stake in Lido for higher APY',
          potentialYield: 5.2,
          yieldIncrease: 5.2 - account.yieldRate,
        });
      } else if (account.assetType === 'stETH') {
        recommendations.push({
          assetType: 'stETH',
          currentYield: account.yieldRate,
          recommendedAction: 'Maintain current position',
          potentialYield: account.yieldRate,
          yieldIncrease: 0,
        });
      } else if (account.assetType === 'USDC') {
        recommendations.push({
          assetType: 'USDC',
          currentYield: account.yieldRate,
          recommendedAction: 'Move to Aave for higher stablecoin yield',
          potentialYield: 4.5,
          yieldIncrease: 4.5 - account.yieldRate,
        });
      }
    });
    
    return {
      recommendations,
      timestamp: new Date().toISOString(),
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting trading insights without calling the actual API
   * @param {Object} marketData - Current market data
   * @param {Array} userPositions - The user's current positions
   * @returns {Promise} - A mock trading insights response
   */
  mockGetTradingInsights: async (marketData, userPositions) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      insights: [
        {
          asset: 'ETH',
          sentiment: 'bullish',
          recommendation: 'Consider increasing ETH exposure with a portion of your available margin.',
          reasoning: 'Recent network activity and institutional inflows suggest positive momentum.',
        },
        {
          asset: 'BTC',
          sentiment: 'neutral',
          recommendation: 'Maintain current BTC positions without significant changes.',
          reasoning: 'Market indicators show consolidation phase with no clear directional bias.',
        },
      ],
      timestamp: new Date().toISOString(),
    };
  },
};

export default openaiService;

