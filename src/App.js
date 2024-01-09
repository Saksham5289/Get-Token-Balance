import React, { useState } from 'react';

function TokenSupplyChecker() {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [error, setError] = useState('');
  const [blockNumber, setBlockNumber] = useState('');

//using exploremantle api to fetch the token balance for a contract address
  const handleGetTokenSupply = async () => {
    try {
      const response = await fetch(
        `https://explorer.mantle.xyz/api?module=account&action=balance&address=${contractAddress}`
      );
      const data = await response.json();
      if (data.status === '1') {
        //putting the decimal point after 3 digits
        let formattedNumber = data.result.toString();
        formattedNumber = formattedNumber.slice(0, 3) + '.' + formattedNumber.slice(3);

        setTokenSupply(formattedNumber);
        setError('');
      } else {
        setTokenSupply('');
        setError(data.message);
      }

//creating the 12 hours ago timestamps to use the other API for fetching the block number at that time 
      const twelveHoursAgoTimestamp = Math.floor(Date.now() / 1000) - 12 * 60 * 60;
      const blockResponse = await fetch(
        `https://explorer.mantle.xyz/api?module=block&action=getblocknobytime&timestamp=${twelveHoursAgoTimestamp}&closest=before`
      );
      const blockData = await blockResponse.json();

      if (blockData.status === '1' && blockData.result && blockData.result.blockNumber) {
        setBlockNumber(blockData.result.blockNumber);
      } else {
        setBlockNumber('Block number not found');
      }
    } catch (error) {
      setTokenSupply('');
      setError('Error fetching token supply');
      setBlockNumber('Error fetching block number');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Token Supply Checker</h2>
      <input
        type="text"
        placeholder="Enter Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        style={{ padding: '8px', marginRight: '8px' }}
      />
      <button
        onClick={handleGetTokenSupply}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Get Token Balance & Block Number 12 Hours Ago
      </button>
      <div style={{ marginTop: '20px' }}>
        {tokenSupply && (
          <p>
            Token Total Supply: {tokenSupply}
          </p>
        )}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {blockNumber !== null ? (
          <p>Block Number 12 Hours Ago: {blockNumber}</p>
        ) : (
          <p>No block number available</p>
        )}
      </div>
    </div>
  );
  
}

export default TokenSupplyChecker;
