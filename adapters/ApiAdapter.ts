//this is my contract that each adapter has to implement, it is purely abstract
//every adapter has to implement it 
export interface ApiAdapter {
    canHandleResponse(rawApiResponse: any): boolean;

    normalize(rawApiResponse: any, viewType: string): {
        normalizedFields: Record<string, any>;
        meta?: {
            source?: string;
            lastUpdated?: number;
        };
    };
}