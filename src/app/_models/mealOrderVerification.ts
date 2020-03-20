export interface MealOrderVerification {
    id: number;
    orderNo: string;
    orderDate: Date;
    isClosed: boolean;
    mealVerificationDetails: MealOrderVerificationDetails[];
}

export interface MealOrderVerificationDetails {
    id: number;
    mealOrderVerificationId: number;
    mealTypeId: number;
    mealType: number;
    sumOrderQty: number;
    adjusmentQty: number;
    swipeQty: number;
    logBookQty: number;
    vendorId: number;
}
