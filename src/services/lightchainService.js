/**
 * Lightchain AI Service
 * 
 * Service for interacting with the Lightchain AI API for zk-proof generation and verification.
 */
import apiService from './api';

// API endpoints
const ENDPOINTS = {
  SUBMIT_PROOF: '/api/v1/proofs/submit',
  VERIFY_PROOF: '/api/v1/proofs/verify',
  COLLATERAL_STATUS: '/api/v1/collateral/status',
  MARGIN_TRADE: '/api/v1/trade/margin',
};

// Base URL for Lightchain AI API
const BASE_URL = process.env.REACT_APP_LIGHTCHAIN_API_URL || 'https://api.lightchain.ai';

/**
 * Service for interacting with Lightchain AI API
 */
const lightchainService = {
  /**
   * Generate a zk-proof for collateral
   * @param {Object} collateralData - Data about the collateral to prove
   * @param {string} collateralData.address - The address of the collateral
   * @param {string} collateralData.assetType - The type of asset (ETH, stETH, etc.)
   * @param {number} collateralData.amount - The amount of collateral
   * @returns {Promise} - The proof generation response
   */
  generateProof: async (collateralData) => {
    try {
      const response = await apiService.post(`${BASE_URL}${ENDPOINTS.SUBMIT_PROOF}`, collateralData);
      return response.data;
    } catch (error) {
      console.error('Error generating proof:', error);
      throw error;
    }
  },
  
  /**
   * Verify a zk-proof
   * @param {string} proofHash - The hash of the proof to verify
   * @returns {Promise} - The verification response
   */
  verifyProof: async (proofHash) => {
    try {
      const response = await apiService.get(`${BASE_URL}${ENDPOINTS.VERIFY_PROOF}`, { proofHash });
      return response.data;
    } catch (error) {
      console.error('Error verifying proof:', error);
      throw error;
    }
  },
  
  /**
   * Get collateral status
   * @param {string} address - The address to check
   * @returns {Promise} - The collateral status response
   */
  getCollateralStatus: async (address) => {
    try {
      const response = await apiService.get(`${BASE_URL}${ENDPOINTS.COLLATERAL_STATUS}`, { address });
      return response.data;
    } catch (error) {
      console.error('Error getting collateral status:', error);
      throw error;
    }
  },
  
  /**
   * Initiate a margin trade
   * @param {Object} tradeData - Data about the trade
   * @param {string} tradeData.proofId - The ID of the proof to use
   * @param {string} tradeData.asset - The asset to trade
   * @param {string} tradeData.position - The position type (long/short)
   * @param {number} tradeData.amount - The amount to trade
   * @param {number} tradeData.leverage - The leverage to use
   * @returns {Promise} - The trade response
   */
  initiateMarginTrade: async (tradeData) => {
    try {
      const response = await apiService.post(`${BASE_URL}${ENDPOINTS.MARGIN_TRADE}`, tradeData);
      return response.data;
    } catch (error) {
      console.error('Error initiating margin trade:', error);
      throw error;
    }
  },
  
  /**
   * Mock function for development/testing
   * Simulates generating a proof without calling the actual API
   * @param {Object} collateralData - Data about the collateral to prove
   * @returns {Promise} - A mock proof response
   */
  mockGenerateProof: async (collateralData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a random proof hash
    const proofHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 10)}`;
    
    return {
      proofId: `proof_${Date.now()}`,
      proofHash,
      status: 'pending',
      timestamp: new Date().toISOString(),
      collateralAddress: collateralData.address,
      assetType: collateralData.assetType,
      amount: collateralData.amount,
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates verifying a proof without calling the actual API
   * @param {string} proofHash - The hash of the proof to verify
   * @returns {Promise} - A mock verification response
   */
  mockVerifyProof: async (proofHash) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      proofHash,
      status: 'verified',
      verifiedAt: new Date().toISOString(),
    };
  },
};

export default lightchainService;

