import React from 'react';
import { User, Calendar, Download } from 'lucide-react';

const CompletedAuctions = () => {
  const ActionButton = ({ type, onClick }) => {
    const styles = {
      report: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white'
    };

    const icons = {
      report: <Download className="w-3 h-3" />
    };

    const labels = {
      report: 'Report'
    };

    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg ${styles[type]}`}
      >
        {icons[type]}
        {labels[type]}
      </button>
    );
  };

  const completedAuctions = [
    {
      title: 'Server Hardware Auction',
      auctioneer: 'Tech Solutions Inc.',
      completionDate: 'Dec 20, 2024',
      winningBid: '₹8,75,000',
      status: 'COMPLETED'
    },
    {
      title: 'Marketing Services Bid',
      auctioneer: 'Creative Agency Ltd.',
      completionDate: 'Dec 18, 2024',
      winningBid: '₹2,50,000',
      status: 'COMPLETED'
    },
    {
      title: 'Catering Contract Auction',
      auctioneer: 'Food Services Co.',
      completionDate: 'Dec 15, 2024',
      winningBid: '₹4,20,000',
      status: 'COMPLETED'
    }
  ];

  return (
    <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 grid grid-cols-6 gap-3 font-semibold text-white">
        <div className="col-span-2">Auction Title</div>
        <div className="col-span-1">Auctioneer</div>
        <div className="col-span-1">Completion Date</div>
        <div className="col-span-1">Winning Bid</div>
        <div className="col-span-1">Action</div>
      </div>
      {completedAuctions.map((auction, index) => (
        <div
          key={index}
          className="px-4 py-3 border-b border-slate-700/30 last:border-b-0 hover:bg-blue-500/5 transition-all duration-300 hover:transform hover:translate-x-2"
        >
          <div className="grid grid-cols-6 gap-3 items-center">
            <div className="col-span-2 font-semibold text-slate-200">
              {auction.title}
            </div>
            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
              <User className="w-3 h-3" />
              {auction.auctioneer}
            </div>
            <div className="col-span-1 flex items-center gap-1 text-slate-400 text-sm">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{auction.completionDate}</span>
            </div>
            <div className="col-span-1 font-bold text-emerald-400">
              {auction.winningBid}
            </div>
            <div className="col-span-1">
              <ActionButton type="report" onClick={() => console.log('Download report')} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedAuctions;