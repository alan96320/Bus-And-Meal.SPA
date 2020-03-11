export interface BusOrderEntry {
    id: number;
    orderEntryDate: Date;
    departmentId: number;
    dormitoryBlockId: number;
    busOrderVerificationId: number;
    isReadyToCollect: boolean;
    busOrderDetails: BusOrderDetails[];
}
export interface BusOrderDetails {
    busOrderId: number;
    busTimeId: number;
    orderQty: number;
}
