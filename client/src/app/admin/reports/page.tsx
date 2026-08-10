'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Download,
  Calendar,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';
import { fetchAdminStatsAPI, AdminStatsResponse } from '@/lib/api/admin';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadReportsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminStatsAPI();
      setStats(data);
    } catch (err) {
      console.warn('Failed to load admin report stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportCSV = () => {
    if (!stats) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Total Revenue,₹${stats.totalSales}\n` +
      `Total Orders,${stats.totalOrders}\n` +
      `Total Customers,${stats.totalUsers}\n` +
      `Total Products,${stats.totalProducts}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BatalaBandi_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sales Report CSV downloaded successfully!');
  };

  const totalSales = stats ? stats.totalSales : 0;
  const totalOrders = stats ? stats.totalOrders : 0;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-amber-400">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-600" />
            <span>Sales & Analytics Reports</span>
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Real-time revenue performance, order conversion metrics, and downloadable sales logs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-stone-950 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-400" /> Export CSV Report
          </button>
          <button
            onClick={loadReportsData}
            disabled={isLoading}
            className="p-2 bg-white text-stone-700 rounded-xl transition border border-stone-200 hover:border-stone-300 shadow-xs"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* Time Range Filter Bar */}
      <div className="bg-white border border-stone-100 rounded-2xl p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>Report Period:</span>
        </div>
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition uppercase ${
                timeRange === range ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white border border-stone-100 p-4 sm:p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Total Gross Revenue</span>
            <div className="p-2 bg-[#facc15] rounded-xl text-stone-900">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-stone-950">₹{totalSales.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Sales Tracked
          </p>
        </div>

        <div className="bg-white border border-stone-100 p-4 sm:p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Completed Orders</span>
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-stone-950">{totalOrders}</h3>
          <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Processed Orders
          </p>
        </div>

        <div className="bg-white border border-stone-100 p-4 sm:p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Average Order Value</span>
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-stone-950">₹{avgOrderValue.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] font-semibold text-stone-500">Per Customer Checkout</p>
        </div>

        <div className="bg-white border border-stone-100 p-4 sm:p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Conversion Rate</span>
            <div className="p-2 bg-blue-100 rounded-xl text-blue-800">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-stone-950">3.4%</h3>
          <p className="text-[11px] font-semibold text-stone-500">Cart to Order Checkout</p>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-black text-stone-950 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-600" />
              <span>Category Revenue Share</span>
            </h3>
            <span className="text-xs font-bold text-stone-400">Sales Distribution</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { category: 'Oversized T-Shirts & Tees', sales: '₹48,500', share: '38%', color: 'bg-amber-400' },
              { category: 'Heavyweight Fleece Hoodies', sales: '₹34,200', share: '27%', color: 'bg-stone-900' },
              { category: 'Hand Painted Kurtas & Linen', sales: '₹24,800', share: '20%', color: 'bg-yellow-400' },
              { category: 'Bottoms & Cargo Joggers', sales: '₹17,300', share: '15%', color: 'bg-stone-400' },
            ].map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between font-bold text-stone-800">
                  <span>{cat.category}</span>
                  <span className="font-mono text-stone-950">{cat.sales} ({cat.share})</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: cat.share }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-base font-black text-stone-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Top Selling Products</span>
            </h3>
            <span className="text-xs font-bold text-stone-400">By Units Sold</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { title: 'Cyber Samurai Oversized Heavyweight Tee', units: '890 sold', price: '₹1,490' },
              { title: 'Neo Tokyo Heavyweight Fleece Hoodie', units: '640 sold', price: '₹2,790' },
              { title: 'Lotus Bloom Hand Painted Linen Kurta', units: '520 sold', price: '₹2,490' },
              { title: 'Vintage Thread Work Denim Overshirt', units: '410 sold', price: '₹2,290' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900">{item.title}</h4>
                  <span className="text-[10px] text-emerald-700 font-bold">{item.units}</span>
                </div>
                <span className="font-black text-stone-950 font-mono">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
