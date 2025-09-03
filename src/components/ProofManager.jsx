import React, { useState } from 'react';
import { useCollateral } from '../contexts/CollateralContext';
import ProofStatusIndicator from './ProofStatusIndicator';
import { Shield, Plus, RefreshCw, Copy, ExternalLink } from 'lucide-react';

const ProofManager = () => {
  const { collateralAccounts, proofs, generateProof, loading } = useCollateral();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCollateral, setSelectedCollateral] = useState('');

  const handleGenerateProof = async () => {
    if (!selectedCollateral) return;
    
    setIsGenerating(true);
    try {
      await generateProof(selectedCollateral);
    } catch (error) {
      console.error('Error generating proof:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Generate New Proof */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-dark-text">Generate New zk-Proof</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Select Collateral Asset
            </label>
            <select
              value={selectedCollateral}
              onChange={(e) => setSelectedCollateral(e.target.value)}
              className="w-full bg-dark-surfaceHover border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:outline-none focus:border-accent"
            >
              <option value="">Choose an asset...</option>
              {collateralAccounts.map(acc => (
                <option key={acc.accountId} value={acc.accountId}>
                  {acc.assetType} - {acc.amount} tokens (${acc.currentValue.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateProof}
              disabled={!selectedCollateral || isGenerating}
              className="w-full py-3 bg-accent hover:bg-accent/90 disabled:bg-dark-border disabled:text-dark-textSecondary text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Proof...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Generate Proof</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-dark-surfaceHover rounded-lg">
          <p className="text-sm text-dark-textSecondary">
            zk-Proofs allow you to prove ownership of collateral without revealing sensitive information. 
            This enables access to margin trading on supported platforms while keeping your assets secure on L1.
          </p>
        </div>
      </div>

      {/* Existing Proofs */}
      <div className="glass-effect rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-dark-text">Your zk-Proofs</h3>
          <div className="text-sm text-dark-textSecondary">
            {proofs.length} total proofs
          </div>
        </div>

        {proofs.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-dark-border mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-dark-text mb-2">No proofs generated yet</h4>
            <p className="text-dark-textSecondary">Generate your first zk-proof to start accessing margin trading.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proofs.map((proof) => (
              <div key={proof.proofId} className="border border-dark-border rounded-lg p-6 hover:bg-dark-surfaceHover transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {proof.assetType === 'ETH' ? '⟠' : 
                       proof.assetType === 'stETH' ? '🔷' : '💰'}
                    </div>
                    <div>
                      <div className="font-semibold text-dark-text">
                        {proof.assetType} Collateral Proof
                      </div>
                      <div className="text-sm text-dark-textSecondary">
                        {proof.collateralAmount} tokens
                      </div>
                    </div>
                  </div>
                  <ProofStatusIndicator status={proof.verificationStatus} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-dark-textSecondary mb-1">Proof Hash</div>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-dark-surface px-2 py-1 rounded font-mono">
                        {proof.proofHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(proof.proofHash)}
                        className="p-1 text-dark-textSecondary hover:text-dark-text transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-dark-textSecondary mb-1">Generated At</div>
                    <div className="text-sm text-dark-text">
                      {new Date(proof.generatedAt).toLocaleDateString()} {new Date(proof.generatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-dark-border">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span>Use for Trading</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-4 py-2 text-dark-textSecondary hover:text-dark-text transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Status</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofManager;