export const generateAuctionWinnerEmail = ({ userName, auctionTitle, bidAmount, auctionEndDate }) => {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; border-radius: 10px;">
    <h2 style="color: #1a1a1a;">🏆 Congratulations, ${userName}!</h2>
    
    <p>We are thrilled to inform you that you have won the auction for:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <tr>
        <td style="padding: 8px; font-weight: bold;">Auction Title:</td>
        <td style="padding: 8px;">${auctionTitle}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Winning Bid:</td>
        <td style="padding: 8px;">₹${bidAmount.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Auction Ended On:</td>
        <td style="padding: 8px;">${new Date(auctionEndDate).toLocaleString()}</td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      Please check your account for payment instructions or contact our support team if you have any questions.
    </p>

    <p style="margin-top: 20px;">
      Thank you for participating in our auctions. We appreciate your trust in <b>Quantum-Bid</b>.
    </p>

    <p style="font-size: 14px; color: #555; margin-top: 30px;">
      Best Regards,<br/>
      <b>Team Quantum-Bid</b>
    </p>
  </div>
  `;
};
