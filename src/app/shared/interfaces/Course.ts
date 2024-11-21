export interface Course {
    code: string;
    name: string;
    hours: number;
    preRequest?: string; 
    grade?: string; 
    completed?: boolean; 
    type?: 'g_core' | 'g_elective' | 'f_core' | 'f_elective' | 'd_core' | 'd_elective';
}