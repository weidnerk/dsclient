export class ResetPasswordViewModel {
    Email: string;
    Code: string;
    Password: string;
}

export class ForgotPasswordViewModel {
    EmailAddress: string;
}

export class ChangePasswordBindingModel {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}
