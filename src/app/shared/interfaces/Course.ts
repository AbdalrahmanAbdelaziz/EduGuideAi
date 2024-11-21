export interface Course {
    code: string;
    name: string;
    hours: number;
    preRequest?: string; 
    grade?: string; 
    completed?: boolean; 
}