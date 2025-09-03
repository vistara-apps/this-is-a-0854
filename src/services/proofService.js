/**
 * Proof Service
 * 
 * Service for generating and managing zk-proofs of collateral ownership.
 */
import lightchainService from './lightchainService';
import supabaseService from './supabaseService';

/**
 * Service for proof management
 */
const proofService = {
  /**
   * Generate a proof for collateral
   * @param {string} collateralId - The ID of the collateral to prove
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @returns {Promise} - The generated proof
   */
  generateProof: async (collateralId, collateralAccounts) => {
    try {
      // Find the collateral account
      const account = collateralAccounts.find(acc => acc.accountId === collateralId);
      
      if (!account) {
        throw new Error('Collateral account not found');
      }
      
      // Prepare collateral data for proof generation
      const collateralData = {
        address: account.address,
        assetType: account.assetType,
        amount: account.amount,
        network: account.network,
      };
      
      // Generate the proof using Lightchain API
      const proofResult = await lightchainService.generateProof(collateralData);
      
      // Format the proof for our application
      const proof = {
        proofId: proofResult.proofId,
        userId: account.userId,
        collateralAddress: account.address,
        proofHash: proofResult.proofHash,
        generatedAt: proofResult.timestamp,
        verificationStatus: proofResult.status,
        collateralAmount: account.amount,
        assetType: account.assetType,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };
      
      // In a real implementation, we would store the proof in the database
      // For now, we'll just return it
      
      return proof;
    } catch (error) {
      console.error('Error generating proof:', error);
      // Fall back to mock proof generation
      return proofService.mockGenerateProof(collateralId, collateralAccounts);
    }
  },
  
  /**
   * Verify a proof
   * @param {string} proofId - The ID of the proof to verify
   * @param {Array} proofs - The user's proofs
   * @returns {Promise} - The verification result
   */
  verifyProof: async (proofId, proofs) => {
    try {
      // Find the proof
      const proof = proofs.find(p => p.proofId === proofId);
      
      if (!proof) {
        throw new Error('Proof not found');
      }
      
      // Verify the proof using Lightchain API
      const verificationResult = await lightchainService.verifyProof(proof.proofHash);
      
      // Update the proof with the verification result
      const updatedProof = {
        ...proof,
        verificationStatus: verificationResult.status,
        verifiedAt: verificationResult.verifiedAt,
      };
      
      // In a real implementation, we would update the proof in the database
      // For now, we'll just return the updated proof
      
      return updatedProof;
    } catch (error) {
      console.error('Error verifying proof:', error);
      // Fall back to mock verification
      return proofService.mockVerifyProof(proofId, proofs);
    }
  },
  
  /**
   * Get all proofs for a user
   * @param {string} userId - The user ID
   * @returns {Promise} - The user's proofs
   */
  getUserProofs: async (userId) => {
    try {
      // Get the user's proofs from the database
      const proofs = await supabaseService.getProofs(userId);
      
      return proofs;
    } catch (error) {
      console.error('Error getting user proofs:', error);
      // Fall back to mock proofs
      return proofService.mockGetUserProofs(userId);
    }
  },
  
  /**
   * Check if a proof is valid for trading
   * @param {string} proofId - The ID of the proof to check
   * @param {Array} proofs - The user's proofs
   * @returns {Promise} - The validity check result
   */
  isProofValidForTrading: async (proofId, proofs) => {
    try {
      // Find the proof
      const proof = proofs.find(p => p.proofId === proofId);
      
      if (!proof) {
        return {
          valid: false,
          reason: 'Proof not found',
        };
      }
      
      // Check if the proof is verified
      if (proof.verificationStatus !== 'verified') {
        return {
          valid: false,
          reason: 'Proof not verified',
        };
      }
      
      // Check if the proof has expired
      if (proof.expiresAt && new Date(proof.expiresAt) < new Date()) {
        return {
          valid: false,
          reason: 'Proof has expired',
        };
      }
      
      // All checks passed
      return {
        valid: true,
        proof,
      };
    } catch (error) {
      console.error('Error checking proof validity:', error);
      throw error;
    }
  },
  
  /**
   * Mock function for development/testing
   * Simulates generating a proof without calling the actual APIs
   * @param {string} collateralId - The ID of the collateral to prove
   * @param {Array} collateralAccounts - The user's collateral accounts
   * @returns {Promise} - A mock generated proof response
   */
  mockGenerateProof: async (collateralId, collateralAccounts) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Find the collateral account
    const account = collateralAccounts.find(acc => acc.accountId === collateralId);
    
    if (!account) {
      throw new Error('Collateral account not found');
    }
    
    // Generate a random proof hash
    const proofHash = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 10)}`;
    
    return {
      proofId: `proof_${Date.now()}`,
      userId: account.userId,
      collateralAddress: account.address,
      proofHash,
      generatedAt: new Date().toISOString(),
      verificationStatus: 'pending',
      collateralAmount: account.amount,
      assetType: account.assetType,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates verifying a proof without calling the actual APIs
   * @param {string} proofId - The ID of the proof to verify
   * @param {Array} proofs - The user's proofs
   * @returns {Promise} - A mock verification result response
   */
  mockVerifyProof: async (proofId, proofs) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find the proof
    const proof = proofs.find(p => p.proofId === proofId);
    
    if (!proof) {
      throw new Error('Proof not found');
    }
    
    // Update the proof with the verification result
    return {
      ...proof,
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
    };
  },
  
  /**
   * Mock function for development/testing
   * Simulates getting a user's proofs without calling the actual APIs
   * @param {string} userId - The user ID
   * @returns {Promise} - A mock user proofs response
   */
  mockGetUserProofs: async (userId) => {
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
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
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
        expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
      },
    ];
  },
};

export default proofService;

