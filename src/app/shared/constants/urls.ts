const BASE_URL = 'https://eduguideai.runasp.net';


export const LOGIN_URL = BASE_URL + '/api/auth/login';             
export const LOGOUT_URL = BASE_URL + '/api/auth/logout';          


export const FORGET_PASSWORD_URL = BASE_URL + '/api/auth/forget-password';
export const RESET_PASSWORD_URL = BASE_URL + '/api/auth/reset-password';


export const STUDENT_REGISTER_URL = BASE_URL + '/api/student/register';
export const ADMIN_REGISTER_URL = BASE_URL + '/api/admin/register';


export const  GET_COURSE_URL = BASE_URL + '/api/general_courses'; // Endpoint to fetch General & Faculty courses
export const GET_DEPARTMENT_COURSES_URL = BASE_URL + '/api/courses/department';



export const UPDATE_GENERAL_COURSES_URL = BASE_URL + '/api/courses/general_update'; 
export const UPDATE_FACULTY_COURSES_URL = BASE_URL + '/api/courses/faculty_update'; 
export const UPDATE_DEPARTMENT_COURSES_URL = BASE_URL + '/api/courses/department_update';
