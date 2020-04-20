// Open prior scan
export class ModelViewTimesSold
{
    TimesSoldRpt: TimesSold[];
    ListingsProcessed: number;
    TotalOrders: number;
    ItemCount: number;
}

export class TimesSold {
    Src: string;
    EbaySellerTitle: string;
    SoldQty: number;
    EbayURL: string;
    RptNumber: number;
    ImageUrl: string;
    SupplierPrice: string;
    LastSold: Date;
    SellingState: string;
    ListingStatus: string;  // status of scanned seller's item
    Listed: Date;           // user's listing
    ListingPrice: number;   // user's listing
    IsMultiVariationListing: boolean;
    ShippingServiceCost: string;    // 10.07.2019 not being used.
    ShippingServiceName: string;
    ItemID: string;         // interesting aspect of TS - i did not have this field defined here but since returned
                            // by the server, TimesSoldView gets 'ammended' to include the field.
    Price: number;          // latest sold price
    EbaySellerPrice: number;
    SellerUPC: string;
    SellerMPN: string;
    MatchCount: number;
    MatchType: number;
    SoldAndShippedBySupplier: boolean;
    SupplierBrand: string;
    ItemURL: string;
    // SupplierPrice: number;
    SellerBrand: string;
    IsSupplierVariation: boolean;
    ProposePrice: number;
    IsVero: boolean;
    SupplierPicURL: string;
    IsSellerVariation: boolean;
    ListingRecCreated: Date;
    Seller: string;
    PriceDelta: number;
    ToListing: boolean;
}

export class OrderHistory {
    ID: number;
    Title: string;
    SellerPrice: string;
    Qty: string;
    DateOfPurchase: Date;
    EbayURL: string;
    ImageUrl: string;
    ListingEnded: boolean;
    ItemId: string;
    // WMCount: number;
    // WMUrl: string;
    ToListing: boolean;
}
export class UpdateToListing {
    ID: number;
    StoreID: number;
    UserID: string;
    ToListing: boolean;
    ItemID: string;
}
// Used for initial scan
export class ModelView {
    Listings: Listing[]
    // MatchedListings: number;
    TotalOrders: number;
    ElapsedSeconds: number;
    PercentTotalItemsProcesssed: number;
    ReportNumber: number;
    ItemCount: number;
}
export class SellerListing {
    ItemID: string;             // ebay seller listing id
    Title: string;
    Seller: string;
    PictureURL: string;
    SellerPrice: number;
    EbayURL: string;
    ItemSpecifics: SellerListingItemSpecific[];
    Variations: Variation[];
    VariationName: string;
}
// used on product research page
export class Listing {
    ID: number;
    ItemID: string;             // ebay seller listing id
    ListingTitle: string;
    Orders: OrderHistory[]
    EbayURL: string;
    Description: string;
    ListingPrice: number;
    PrimaryCategoryID: string;
    PrimaryCategoryName: string;
    PictureURL: string;
    Variation: boolean;
    VariationDescription: string;
    Listed: Date;
    ListedItemID: string;
    CheckShipping: boolean;
    CheckSource: boolean;   // that supplier is walmart
    CheckVero: boolean;
    CheckCategory: boolean;
    CheckCompetition: number;
    CheckSellerShipping: boolean;
    Profit: number;
    ProfitMargin: number;
    RptNumber: number;
    SellerSold: number;
    CheckSupplierPrice: boolean;
    CheckSupplierItem: boolean;
    CheckMainCompetitor: number;
    CheckSupplierPics: boolean;
    CheckIsVariation: boolean;
    CheckVariationURL: boolean;
    Created: Date;
    SupplierID: number;
    SupplierItem: SupplierItem;
    StoreID:  number;
    Qty: number;
    Updated: Date;
    Warning: string[];
    ItemSpecifics: ListingItemSpecific[];
    eBaySellerURL: string;
    SellerListing: SellerListing | null;
}
export class ListingView extends Listing {
    Seller: string;
    Title: string;
    ListedByName: string;
    CreatedByName: string;
    UpdatedByName: string;
    SupplierPicURL: string;
}
export class SellerListingItemSpecific
{
    id: number;
    sellerItemId: string;
    itemName: string;
    itemValue: string;
    listing: Listing;
}
export class Dashboard {
    listed: number;
    oos: number;
    notListed: number;
}
export class StoreAnalysis {
    dbIsMissingItems: string[];
}

// used to compare source and ebay images
// this is a model view
export class SearchReport {
    PostedListingID: number;
    SourceItemNo: string;
    SourceUrl: string;
    EbayUrl: string;
    //DateOfPurchase: Date;
    EbayImgCount: number;
    SourceTitle: string;
    EbayTitle: string;
    EbaySeller: string;
    SoldQty: number;
    Limit: string;
    Availability: string;
    SourcePrice: number;
    EbaySellerPrice: number;
    SourceRating: string;
    PrimaryCategoryID: string;
    PrimaryCategoryName: string;
    FeedbackScore: number;
    SourceDescription: string;
    EbayItemId: string;
    EbayDescription: string;
    ShippingAmount: number;
    PictureUrl: string;
    CategoryId: number;
    Listed: Date;
    Removed: Date;
    PostedListingCreated: Date;
    MinPrice: number;           // need to sell for at least this to break even
    CostPlusTax: number;
    ListedQty: number;
    DatePurchased: Date;
    ListedItemID: string;
}

export class SourceCategory {
    ID: number;
    SubCategory: string;
}

export class SearchHistoryView {
    seller: string;
    updated: Date;
    id: number;
    userName: string;
    listingCount: number;
    calculateMatch: Date;
}

// Used in committing profit numbers when creating Listing.
export class DeriveProfit {
    profit: number;
    profitMargin: number;
}

export class SellerProfile {
    seller: string;
    note: string;
}
export class ListingNote {
    note: string;
    itemID: string;
    updated: Date;
    storeID: number;
}
export class ListingNoteView extends ListingNote {
    userName: string;
}
export class SupplierItem {
    ID: number;
    MatchCount: number;
    ItemURL : string;
    SoldAndShippedBySupplier: boolean; 
    SupplierBrand : string;
    SupplierPrice : number;
    IsVariation : boolean;
    SupplierPicURL : string;
    UPC : string;
    MPN : string;
    Description : string;
    ItemID : string;
    OutOfStock : boolean;
    ShippingNotAvailable: boolean; 
    Arrives: Date;
    IsVERO: boolean;
    VariationPicURL: string[];
    VariationName: string;
    usItemId: string[];
    SupplierVariation: SupplierVariation[];
    CanList: string[];
    IsFreightShipping: boolean;
    Warning: string[];
    Updated: Date;
    SourceID: number;
}
export class SalesOrder {
    ID: number;
    SupplierOrderNumber: string;
    eBayOrderNumber: string;
    ListedItemID: string;
    Qty: number;
    DatePurchased: Date;
    I_Paid: number;
}

// return type when getting proposed price 
export class PriceProfit {
    breakEven: number;
    proposePrice: number;
}

export class SellerVariationSpecifics
{
    NameValueList: NameValueList;
}

export class NameValueList
{
    Name: string;
    Value: string;
}
export class SellingStatus
{
    QuantitySold: string;
    QuantitySoldByPickupInStore: string;
}
export class Variation
{
    StartPrice: string;
    Quantity: string;
    VariationSpecifics: SellerVariationSpecifics;
    SellingStatus: SellingStatus;
}
export class SupplierVariation {
    ItemID : string;
    URL : string;
    Variation : string;
    Price : number;
    Images: string[];
}
export class ListingItemSpecific
{
    id: number;
    listingID: number;
    itemName: string;
    itemValue: string;
}
export class ListingLog {
    id: number;
    listingID: number;
    note: string;
    created: Date;
    message: string;
}
