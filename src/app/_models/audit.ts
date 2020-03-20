export interface Audit {
    id: number;
    tableName: string;
    dateTime: Date;
    userId: number;
    keyValues: string;
    oldValues: string;
    newValues: string;
    isUpdate: boolean;
}
