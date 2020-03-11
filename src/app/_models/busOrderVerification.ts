export interface BusOrderVerification {
    id: number;
    orderNo: string;
    orderdate: Date;
    isClosed: boolean;
    busOrderVerificationDetails: BusOrderVerificationDetails;
}

export interface BusOrderVerificationDetails {
    id: number;
    busOrderVerificationId: number;
    busTimeId: number;
    sumOrderQty: number;
}
