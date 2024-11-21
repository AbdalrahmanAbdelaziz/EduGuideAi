export class Student{
    id?: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    confirmPassword?: string;
    profilePic?: string;  
    level?: string;  
    department?: string; 
    gpa?: number;  
    hours?: number;
    token?: string;
}