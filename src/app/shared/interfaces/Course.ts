export interface Course {
    code: string;
    name: string;
    hours: string;
    preRequest: string; 
    grade?: string; 
    completed?: boolean; 
    type?: 'g_core' | 'g_elective' | 'f_core' | 'f_elective' | 'cs_core' | 'cs_elective' | 'is_core' | 'is_elective' | 'ai_core' | 'ai_elective' | 'it_core' | 'it_elective';
}