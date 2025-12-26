export type ViewType="card" | "table" | "chart";

export interface ApiConfig{
    urls: string;
    refreshInterval: number;
}

export interface FieldConfig{
    path: string;
    label: string;
}
export interface tableConfig{
    rowPath: string;
    columns: string[];
}

export interface chartConfig{
    dataPath: string;
    xKey:string;
    yKey:string;
}


export interface Widget{
    id: string;
    name: string;
    apis: ApiConfig[];
    fields: FieldConfig[];
    viewType: ViewType;
    tableConfig?:tableConfig;
    chartConfig?:chartConfig;

}



