export interface MealOrderEntry {
    id: number;
    orderEntryDate: Date;
    departmentId: number;
    mealOrderVerificationId: number;
    isReadyToCollect: boolean;
    userId: number;
    mealOrderDetails: MealOrderDetails[];
}

export interface MealOrderDetails {
    id: number;
    mealOrderId: number;
    mealTypeId: number;
    orderQty: number;
}
