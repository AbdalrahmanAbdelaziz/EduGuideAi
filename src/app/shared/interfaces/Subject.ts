export interface Subject {
    code: string;
    name: string;
    hours: number;
    preRequest?: string; 
    total?: number; 
    grade?: string; 
    completed?: boolean; 
}