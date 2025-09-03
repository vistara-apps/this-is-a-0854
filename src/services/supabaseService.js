/**
 * Supabase Service
 * 
 * Service for interacting with Supabase for data storage and user management.
 */
import apiService from './api';

// Supabase API URL and key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || '';

// Table names
const TABLES = {
  USERS: 'users',
  COLLATERAL_ACCOUNTS: 'collateral_accounts',
  PROOFS: 'proofs',
  TRADES: 'trades',
  YIELD_AGGREGATORS: 'yield_aggregators',
  SUBSCRIPTIONS: 'subscriptions',
};

/**
 * Service for interacting with Supabase
 */
const supabaseService = {
  /**
   * Initialize Supabase client
   * This would typically use the Supabase JS client, but we're using our API service for consistency
   */
  init: () => {
    // Set up headers for Supabase
    apiService.setAuthToken(SUPABASE_KEY);
  },
  
  /**
   * Get data from a table
   * @param {string} table - The table name
   * @param {Object} query - Query parameters
   * @returns {Promise} - The query response
   */
  getData: async (table, query = {}) => {
    try {
      const response = await apiService.get(`${SUPABASE_URL}/rest/v1/${table}`, query);
      return response.data;
    } catch (error) {
      console.error(`Error getting data from ${table}:`, error);
      throw error;
    }
  },
  
  /**
   * Insert data into a table
   * @param {string} table - The table name
   * @param {Object} data - The data to insert
   * @returns {Promise} - The insert response
   */
  insertData: async (table, data) => {
    try {
      const response = await apiService.post(`${SUPABASE_URL}/rest/v1/${table}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error inserting data into ${table}:`, error);
      throw error;
    }
  },
  
  /**
   * Update data in a table
   * @param {string} table - The table name
   * @param {Object} data - The data to update
   * @param {Object} query - Query parameters to identify the record(s) to update
   * @returns {Promise} - The update response
   */
  updateData: async (table, data, query = {}) => {
    try {
      const response = await apiService.put(`${SUPABASE_URL}/rest/v1/${table}`, data, { params: query });
      return response.data;
    } catch (error) {
      console.error(`Error updating data in ${table}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete data from a table
   * @param {string} table - The table name
   * @param {Object} query - Query parameters to identify the record(s) to delete
   * @returns {Promise} - The delete response
   */
  deleteData: async (table, query = {}) => {
    try {
      const response = await apiService.delete(`${SUPABASE_URL}/rest/v1/${table}`, { params: query });
      return response.data;
    } catch (error) {
      console.error(`Error deleting data from ${table}:`, error);
      throw error;
    }
  },
  
  /**
   * Get user data
   * @param {string} userId - The user ID
   * @returns {Promise} - The user data
   */
  getUser: async (userId) => {
    try {
      return await supabaseService.getData(TABLES.USERS, { userId });
    } catch (error) {
      console.error('Error getting user:', error);
      // Fall back to mock data if API call fails
      return supabaseService.mockGetUser(userId);
    }
  },
  
  /**
   * Get user's collateral accounts
   * @param {string} userId - The user ID
   * @returns {Promise} - The collateral accounts
   */
  getCollateralAccounts: async (userId) => {
    try {
      return await supabaseService.getData(TABLES.COLLATERAL_ACCOUNTS, { userId });
    } catch (error) {
      console.error('Error getting collateral accounts:', error);
      // Fall back to mock data if API call fails
      return supabaseService.mockGetCollateralAccounts(userId);
    }
  },
  
  /**
   * Get user's proofs
   * @param {string} userId - The user ID
   * @returns {Promise} - The proofs
   */
  getProofs: async (userId) => {
    try {
      return await supabaseService.getData(TABLES.PROOFS, { userId });
    } catch (error) {
      console.error('Error getting proofs:', error);
      // Fall back to mock data if API call fails
      return supabaseService.mockGetProofs(userId);
    }
  },
  
  /**
   * Get user's subscription
   * @param {string} userId - The user ID
   * @returns {Promise} - The subscription data
   */
  getSubscription: async (userId) => {
    try {
      return await supabaseService.getData(TABLES.SUBSCRIPTIONS, { userId });
    } catch (error) {
      console.error('Error getting subscription:', error);
      // Fall back to mock data if API call fails
      return supabaseService.mockGetSubscription(userId);
    }
  },
  
  /**
   * Update user's subscription
   * @param {string} userId - The user ID
   * @param {Object} subscriptionData - The subscription data to update
   * @returns {Promise} - The update response
   */
  updateSubscription: async (userId, subscriptionData) => {
    try {
      return await supabaseService.updateData(TABLES.SUBSCRIPTIONS, subscriptionData, { userId });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },
  
  /**
   * Get yield aggregators
   * @returns {Promise} - The yield aggregators
   */
  getYieldAggregators: async () => {
    try {
      return await supabaseService.getData(TABLES.YIELD_AGGREGATORS);
    } catch (error) {
      console.error('Error getting yield aggregators:', error);
      // Fall back to mock data if API call fails
      return supabaseService.mockGetYieldAggregators();
    }
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting user data without calling the actual API
   * @param {string} userId - The user ID
   * @returns {Promise} - A mock user data response
   */
  mockGetUser: async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      userId,
      email: `user@${userId.slice(0, 6)}.eth`,
      subscriptionTier: 'basic',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      updatedAt: new Date().toISOString(),
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting collateral accounts without calling the actual API
   * @param {string} userId - The user ID
   * @returns {Promise} - A mock collateral accounts response
   */
  mockGetCollateralAccounts: async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return [
      {
        accountId: 'acc_1',
        userId,
        network: 'ethereum',
        address: userId,
        assetType: 'ETH',
        amount: 12.5,
        yieldRate: 4.2,
        yieldAccrued: 2.45,
        lastYieldUpdate: new Date().toISOString(),
        currentValue: 31250, // Assuming ETH price of $2,500
      },
      {
        accountId: 'acc_2',
        userId,
        network: 'ethereum',
        address: userId,
        assetType: 'stETH',
        amount: 8.3,
        yieldRate: 5.1,
        yieldAccrued: 1.87,
        lastYieldUpdate: new Date().toISOString(),
        currentValue: 20750, // Assuming stETH price of $2,500
      },
      {
        accountId: 'acc_3',
        userId,
        network: 'ethereum',
        address: userId,
        assetType: 'USDC',
        amount: 15000,
        yieldRate: 3.8,
        yieldAccrued: 342.5,
        lastYieldUpdate: new Date().toISOString(),
        currentValue: 15000, // USDC is pegged to USD
      },
    ];
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting proofs without calling the actual API
   * @param {string} userId - The user ID
   * @returns {Promise} - A mock proofs response
   */
  mockGetProofs: async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      {
        proofId: 'proof_1',
        userId,
        collateralAddress: userId,
        proofHash: '0x1234...abcd',
        generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        verificationStatus: 'verified',
        collateralAmount: 12.5,
        assetType: 'ETH',
      },
      {
        proofId: 'proof_2',
        userId,
        collateralAddress: userId,
        proofHash: '0x5678...efgh',
        generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        verificationStatus: 'pending',
        collateralAmount: 8.3,
        assetType: 'stETH',
      },
    ];
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting subscription data without calling the actual API
   * @param {string} userId - The user ID
   * @returns {Promise} - A mock subscription data response
   */
  mockGetSubscription: async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      userId,
      tier: 'basic',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      features: ['yield-aggregation', 'basic-analytics'],
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting yield aggregators without calling the actual API
   * @returns {Promise} - A mock yield aggregators response
   */
  mockGetYieldAggregators: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        aggregatorId: 'agg_1',
        name: 'Lido',
        apyEndpoint: 'https://api.lido.fi/v1/apy',
        currentApy: 5.2,
        description: 'Liquid staking solution for ETH',
        riskLevel: 'low',
        protocol: 'Lido',
      },
      {
        aggregatorId: 'agg_2',
        name: 'Aave',
        apyEndpoint: 'https://api.aave.com/v1/apy',
        currentApy: 4.5,
        description: 'Lending and borrowing protocol',
        riskLevel: 'medium',
        protocol: 'Aave',
      },
      {
        aggregatorId: 'agg_3',
        name: 'Compound',
        apyEndpoint: 'https://api.compound.finance/v1/apy',
        currentApy: 3.8,
        description: 'Algorithmic money market protocol',
        riskLevel: 'medium',
        protocol: 'Compound',
      },
    ];
  },
};

export default supabaseService;

