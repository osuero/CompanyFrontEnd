export interface Category
{
    id?: string;
    title?: string;
    slug?: string;
}

export interface Application
{
    id?: string;
    name?: string;
    description?: string;
    category?: string;
    url?: number;
}
