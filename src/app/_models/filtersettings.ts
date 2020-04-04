import { SearchHistoryView } from './orderhistory';

export class FilterSettings
{
    seller: string | null;
    rptNumber: number = 0;
    daysBack: number;
    minSold: number;
    minPrice: number | null;
    maxPrice: number | null;
    showNoOrders: string | null;
    lastScan: Date | null;
    showFilter = false;
    activeStatusOnly: boolean;
    nonVariation: boolean;
    calculateMatch: Date | null;
}
