
'use client';

import { usePreciousMetalsData } from '@/hooks/usePreciousMetalsData';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function PreciousMetalsTable() {
  const { data, loading, error, lastUpdated, refreshData } = usePreciousMetalsData();

  const getChangeColor = (change: number) => {
    if (change > 0) return 'bg-green-500 hover:bg-green-600';
    if (change < 0) return 'bg-red-500 hover:bg-red-600';
    return 'bg-gray-500 hover:bg-gray-600';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    }).format(price);
  };

  const goldProducts = data.filter(item => 
    item.Ürün.includes('ALTIN') || item.Ürün.includes('Altın') || item.Ürün.includes('USD/KG') || item.Ürün.includes('EUR/KG')
  );
  
  const silverProducts = data.filter(item => 
    item.Ürün.includes('GÜM')
  );

  if (loading) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 rounded-md bg-red-50 border border-red-200">Hata: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Kıymetli Maden Fiyatları</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Son Güncelleme: {lastUpdated}
              </div>
              <Button size="sm" variant="outline" onClick={refreshData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Yenile
              </Button>
            </div>
        </div>
      <Card>
        <CardHeader>
            <CardTitle>Altın Fiyatları</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead>Değişim</TableHead>
                <TableHead className="text-right">Alış</TableHead>
                <TableHead className="text-right">Satış</TableHead>
                <TableHead className="text-right">Fark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goldProducts.map((item) => (
                <TableRow key={item.Ürün}>
                  <TableCell className="font-medium">{item.Ürün}</TableCell>
                  <TableCell>
                    <Badge className={getChangeColor(item.Değişim)}>
                      %{item.Değişim.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(item.Alış)} ₺</TableCell>
                  <TableCell className="text-right">{formatPrice(item.Satış)} ₺</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.Satış - item.Alış)} ₺
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Gümüş Fiyatları</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün</TableHead>
                <TableHead>Değişim</TableHead>
                <TableHead className="text-right">Alış</TableHead>
                <TableHead className="text-right">Satış</TableHead>
                <TableHead className="text-right">Fark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {silverProducts.map((item) => (
                <TableRow key={item.Ürün}>
                  <TableCell className="font-medium">{item.Ürün}</TableCell>
                  <TableCell>
                    <Badge className={getChangeColor(item.Değişim)}>
                      %{item.Değişim.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(item.Alış)} ₺</TableCell>
                  <TableCell className="text-right">{formatPrice(item.Satış)} ₺</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.Satış - item.Alış)} ₺
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
