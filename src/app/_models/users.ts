export interface Users{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    gddbId: string;
    adminStatus: boolean;
    lockTransStatus: number;
    userModuleRights: UserModuleRights[];
    userDepartment: userDepartment[];
}

export interface UserModuleRights{
    id: number;
    ModuleRightsId: number;
    moduleRights?: ModuleRights[];
    read: boolean;
    write: boolean;
}

export interface userDepartment{
    id: number;
    departmentId: number;
    userId: number;
}

export interface ModuleRights{  
    id: number;
    code: string;
    description: string;
}
