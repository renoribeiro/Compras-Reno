import { BarChart3, Box, CalendarCheck, Clock, ShoppingBag, TrendingDown } from 'lucide-react';
import StatusCard from '@/components/dashboard/StatusCard';
import QuoteHistory from '@/components/dashboard/QuoteHistory';
import SuppliersSummary from '@/components/dashboard/SuppliersSummary';
import NextScheduledQuote from '@/components/dashboard/NextScheduledQuote';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useSuppliers } from '@/hooks/useSuppliers';
import { useItems } from '@/hooks/useItems';
import { useQuotes } from '@/hooks/useQuotes';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { suppliers, loading: suppliersLoading } = useSuppliers();
  const { items, loading: itemsLoading } = useItems();
  const { quotes, loading: quotesLoading } = useQuotes();
  
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    totalSuppliers: 0,
    lastQuoteDate: 'Nunca',
    nextQuoteDate: 'Não agendada',
  });

  const [quoteHistoryData, setQuoteHistoryData] = useState<any[]>([]);
  const [suppliersWithBestPrice, setSuppliersWithBestPrice] = useState<any[]>([]);

  useEffect(() => {
    console.log('🔍 Dashboard useEffect - Estados:', { suppliersLoading, itemsLoading, quotesLoading });
    if (!suppliersLoading && !itemsLoading && !quotesLoading) {
      console.log('✅ Todos os dados carregados, processando dashboard...');
      // Calcular dados do dashboard
      const lastQuote = quotes.find(q => q.status === 'completed');
      const nextQuote = quotes.find(q => q.status === 'pending');
      
      setDashboardData({
        totalItems: items.length,
        totalSuppliers: suppliers.length,
        lastQuoteDate: lastQuote 
          ? new Date(lastQuote.createdAt).toLocaleDateString('pt-BR') 
          : 'Nunca',
        nextQuoteDate: nextQuote 
          ? (nextQuote.deliveryDate || 'Não definida')
          : 'Não agendada',
      });

      // Real quote history data based on actual database records
      const realHistory = quotes.slice(0, 4).map((quote) => {
        // Calculate real total value from quote items if available
        const totalValue = quote.items?.reduce((total, item) => {
          const bestPrice = item.suppliers?.reduce((min, supplier) => 
            supplier.price > 0 && (min === 0 || supplier.price < min) ? supplier.price : min, 0) || 0;
          return total + (bestPrice * item.requestedQuantity);
        }, 0) || 0;

        return {
          id: quote.id,
          date: new Date(quote.createdAt).toLocaleDateString('pt-BR'),
          totalItems: quote.totalItems,
          totalValue: totalValue,
          status: quote.status === 'completed' ? 'completed' as const : 
                 quote.status === 'pending' ? 'scheduled' as const : 'completed' as const
        };
      });
      setQuoteHistoryData(realHistory);

      // Real supplier data with actual quote participation count
      const suppliersWithData = suppliers.map(supplier => {
        // Count how many quotes this supplier has participated in
        const participationCount = quotes.reduce((count, quote) => {
          const hasParticipated = quote.items?.some(item => 
            item.suppliers?.some(s => s.supplierId === supplier.id)
          ) || false;
          return hasParticipated ? count + 1 : count;
        }, 0);

        return {
          ...supplier,
          bestPriceCount: participationCount
        };
      });
      setSuppliersWithBestPrice(suppliersWithData);
      console.log('🎯 Dashboard dados processados com sucesso');
    }
  }, [suppliers, items, quotes, suppliersLoading, itemsLoading, quotesLoading]);

  const nextScheduledQuoteData = {
    date: '01/06/2025',
    time: '08:00',
    itemsCount: dashboardData.totalItems,
    daysRemaining: 14,
  };

  if (suppliersLoading || itemsLoading || quotesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Total de Itens"
          value={dashboardData.totalItems.toString()}
          description="Itens na lista de compras"
          icon={<ShoppingBag className="h-4 w-4" />}
          variant="info"
        />
        <StatusCard
          title="Fornecedores"
          value={dashboardData.totalSuppliers.toString()}
          description="Fornecedores cadastrados"
          icon={<Box className="h-4 w-4" />}
          variant="default"
        />
        <StatusCard
          title="Última Cotação"
          value={dashboardData.lastQuoteDate}
          description="Data da última cotação"
          icon={<CalendarCheck className="h-4 w-4" />}
          variant="success"
        />
        <StatusCard
          title="Próxima Cotação"
          value={dashboardData.nextQuoteDate}
          description="Data da próxima cotação"
          icon={<Clock className="h-4 w-4" />}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <QuoteHistory quotes={quoteHistoryData} />
        </div>
        <div>
          <NextScheduledQuote {...nextScheduledQuoteData} />
        </div>
      </div>

      <div>
        <SuppliersSummary suppliers={suppliersWithBestPrice} />
      </div>
    </div>
  );
};

export default Dashboard;