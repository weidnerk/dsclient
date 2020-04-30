export class UserProfile {
    userID: string;
    firstname: string;
    lastname: string;
    selectedStore: number;
}
export class UserProfileView {
    userID: string;
    firstname: string;
    lastname: string;
    selectedStore: number;
    username: string;
}

// a little different from actual UserProfile in AccountController since need to pass userName so we can look up id
// export class UserProfileVM extends UserProfile {
//     userName: string;
//     ApplicationID: number;
// }

// see comment in API for TokenStatusTypeCustom
export class TokenStatusTypeCustom {
    ExpirationTime: string;
    Status: string;
    StatusStr: string;
}

export class UserSettings {
    userID: string;
    //appID: string;
    //devID: string;
    //certID: string;
    //token: string;
    //userName: string;
    //storeName: string;
    //firstName: string;
    storeID: number;
    pctProfit: number;
    handlingTime: number;
    payPalEmail: string;
    shippingProfile: string;
}

export class UserSettingsView extends UserSettings {
    appID: string;
    devID: string;
    certID: string;
    token: string;
    userName: string;
    storeName: string;
    firstName: string;
    ebayKeyID: number;
    APIEmail: string;
}

export class AppIDSelect {
    value: string;          // presently, both value and viewValue set to AppID
    viewValue: string;
}
export class UserStoreView {
    userID: string;
    storeID: number;
    storeName: string;
    eBayUserID: string;
}
export class UserProfileKeys {
    id: number;
    appID: string;
    certID: string;
    devID: string
    APIEmail: string;
}
export class UserProfileKeysView {
    userID: string;
    storeID: number;
    appID: string;
    certID: string;
    devID: string
    APIEmail: string;
    token: string;
}
// export class UserToken {
//     token: string;
//     storeID: number;
//     keysID: number;
//     userID: string;
// }

export interface eBayUser {
    eBayUserID: string;
    payPalEmail: string;
}