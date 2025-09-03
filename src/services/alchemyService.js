/**
 * Alchemy Service
 * 
 * Service for interacting with the Alchemy API to fetch blockchain data.
 */
import apiService from './api';

// API endpoints
const ENDPOINTS = {
  GET_TOKEN_BALANCES: '/v2/{apiKey}/getTokenBalances',
  GET_ASSET_TRANSFERS: '/v2/{apiKey}/getAssetTransfers',
  GET_TOKEN_METADATA: '/v2/{apiKey}/getTokenMetadata',
};

// Base URL for Alchemy API
const BASE_URL = process.env.REACT_APP_ALCHEMY_API_URL || 'https://eth-mainnet.g.alchemy.com';

// Alchemy API key
const API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY || '';

/**
 * Service for interacting with Alchemy API
 */
const alchemyService = {
  /**
   * Get token balances for an address
   * @param {string} address - The address to check
   * @returns {Promise} - The token balances response
   */
  getTokenBalances: async (address) => {
    try {
      const endpoint = ENDPOINTS.GET_TOKEN_BALANCES.replace('{apiKey}', API_KEY);
      const response = await apiService.get(`${BASE_URL}${endpoint}`, { address });
      return response.data;
    } catch (error) {
      console.error('Error getting token balances:', error);
      throw error;
    }
  },
  
  /**
   * Get asset transfers for an address
   * @param {string} address - The address to check
   * @param {Object} options - Additional options
   * @param {string} options.fromBlock - The starting block
   * @param {string} options.toBlock - The ending block
   * @param {Array} options.contractAddresses - List of contract addresses to filter by
   * @returns {Promise} - The asset transfers response
   */
  getAssetTransfers: async (address, options = {}) => {
    try {
      const endpoint = ENDPOINTS.GET_ASSET_TRANSFERS.replace('{apiKey}', API_KEY);
      const params = {
        address,
        ...options,
      };
      const response = await apiService.get(`${BASE_URL}${endpoint}`, params);
      return response.data;
    } catch (error) {
      console.error('Error getting asset transfers:', error);
      throw error;
    }
  },
  
  /**
   * Get token metadata
   * @param {string} contractAddress - The token contract address
   * @returns {Promise} - The token metadata response
   */
  getTokenMetadata: async (contractAddress) => {
    try {
      const endpoint = ENDPOINTS.GET_TOKEN_METADATA.replace('{apiKey}', API_KEY);
      const response = await apiService.get(`${BASE_URL}${endpoint}`, { contractAddress });
      return response.data;
    } catch (error) {
      console.error('Error getting token metadata:', error);
      throw error;
    }
  },
  
  /**
   * Calculate yield for staked assets
   * @param {string} address - The address to check
   * @param {string} assetType - The type of asset (ETH, stETH, etc.)
   * @returns {Promise} - The yield calculation response
   */
  calculateYield: async (address, assetType) => {
    try {
      // This would involve multiple API calls and calculations
      // For now, we'll return mock data
      return alchemyService.mockCalculateYield(address, assetType);
    } catch (error) {
      console.error('Error calculating yield:', error);
      throw error;
    }
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting token balances without calling the actual API
   * @param {string} address - The address to check
   * @returns {Promise} - A mock token balances response
   */
  mockGetTokenBalances: async (address) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      address,
      tokenBalances: [
        {
          contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
          tokenBalance: '0x' + (12.5 * 10**18).toString(16),
        },
        {
          contractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', // stETH
          tokenBalance: '0x' + (8.3 * 10**18).toString(16),
        },
        {
          contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
          tokenBalance: '0x' + (15000 * 10**6).toString(16),
        },
      ],
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates calculating yield without calling the actual API
   * @param {string} address - The address to check
   * @param {string} assetType - The type of asset
   * @returns {Promise} - A mock yield calculation response
   */
  mockCalculateYield: async (address, assetType) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const yieldRates = {
      ETH: 4.2,
      stETH: 5.1,
      USDC: 3.8,
    };
    
    const amounts = {
      ETH: 12.5,
      stETH: 8.3,
      USDC: 15000,
    };
    
    const yieldRate = yieldRates[assetType] || 0;
    const amount = amounts[assetType] || 0;
    const yieldAccrued = (amount * yieldRate / 100) * (Math.random() * 0.5 + 0.5); // Random factor for variation
    
    return {
      address,
      assetType,
      amount,
      yieldRate,
      yieldAccrued,
      lastUpdate: new Date().toISOString(),
    };
  },
};

export default alchemyService;

