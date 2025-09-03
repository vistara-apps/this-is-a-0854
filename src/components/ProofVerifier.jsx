import React, { useState } from 'react';
import { Shield, Check, AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import proofService from '../services/proofService';
import ProofStatusIndicator from './ProofStatusIndicator';

const ProofVerifier = ({ proof, onVerificationComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      // Call the proof service to verify the proof
      const result = await proofService.verifyProof(proof.proofId, [proof]);
      setVerificationResult(result);
      
      // Call the onVerificationComplete callback if provided
      if (onVerificationComplete) {
        onVerificationComplete(result);
      }
    } catch (err) {
      console.error('Error verifying proof:', err);
      setError('Failed to verify proof. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const isVerified = proof.verificationStatus === 'verified' || (verificationResult && verificationResult.verificationStatus === 'verified');
  const isPending = proof.verificationStatus === 'pending' && !verificationResult;
  const isFailed = proof.verificationStatus === 'failed' || (verificationResult && verificationResult.verificationStatus === 'failed');

  return (
    <div className="glass-effect rounded-lg p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-dark-text">Proof Verification</h3>
        </div>
        
        <ProofStatusIndicator status={verificationResult?.verificationStatus || proof.verificationStatus} />
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-dark-textSecondary mb-1">Proof ID</div>
            <div className="text-dark-text font-mono text-sm bg-dark-surfaceHover px-3 py-2 rounded">
              {proof.proofId}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-dark-textSecondary mb-1">Asset Type</div>
            <div className="text-dark-text">
              {proof.assetType} ({proof.collateralAmount} tokens)
            </div>
          </div>
          
          <div>
            <div className="text-sm text-dark-textSecondary mb-1">Generated At</div>
            <div className="text-dark-text">
              {new Date(proof.generatedAt).toLocaleString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-dark-textSecondary mb-1">Expires At</div>
            <div className="text-dark-text">
              {proof.expiresAt ? new Date(proof.expiresAt).toLocaleString() : 'Never'}
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-dark-textSecondary mb-1">Proof Hash</div>
          <div className="text-dark-text font-mono text-sm bg-dark-surfaceHover px-3 py-2 rounded break-all">
            {proof.proofHash}
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-dark-text">{error}</div>
          </div>
        )}
        
        {isVerified && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-dark-text">Proof Verified</h4>
              <p className="text-sm text-dark-textSecondary">
                This proof has been verified and can be used for margin trading.
                {verificationResult?.verifiedAt && (
                  <> Verified at {new Date(verificationResult.verifiedAt).toLocaleString()}.</>
                )}
              </p>
            </div>
          </div>
        )}
        
        {isPending && !isVerifying && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-dark-text">Verification Pending</h4>
              <p className="text-sm text-dark-textSecondary">
                This proof is pending verification. Click the button below to verify it.
              </p>
            </div>
          </div>
        )}
        
        {isFailed && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-dark-text">Verification Failed</h4>
              <p className="text-sm text-dark-textSecondary">
                This proof could not be verified. Please generate a new proof.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handleVerify}
            disabled={isVerifying || isVerified}
            className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:bg-dark-border disabled:text-dark-textSecondary text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : isVerified ? (
              <>
                <Check className="w-4 h-4" />
                <span>Verified</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Verify Proof</span>
              </>
            )}
          </button>
          
          {isVerified && (
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>Use for Trading</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProofVerifier;

