import { AbstractControl, ValidationErrors } from "@angular/forms";

export const PasswordsMatchValidators = (passwordControlName: string, confirmPasswordControlName: string) => {
    const validator = (form: AbstractControl) => {
        const passwordControl = form.get(passwordControlName);
        const confirmPasswordControl = form.get(confirmPasswordControlName);

        if (!passwordControl || !confirmPasswordControl) return;

        if (passwordControl.value !== confirmPasswordControl.value) {
            confirmPasswordControl.setErrors({ notMatch: true });
        } else {
            const errors: ValidationErrors = confirmPasswordControl.errors || {};
            if (errors['notMatch']) {
                delete errors['notMatch'];
            }
            if (Object.keys(errors).length > 0) {
                confirmPasswordControl.setErrors(errors);
            } else {
                confirmPasswordControl.setErrors(null);
            }
        }
    }

    return validator;
}
