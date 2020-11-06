import { AxiosInstance } from "axios";

export interface PaginationData<T> {
    rows: T[]
    meta: {
        page: number,
        limit: number,
        totalRows: number,
        totalPages: number
    }
}

export type Query<T> = Partial<T> & { page: number, limit: number }


export default interface Service<T extends any> {
    http: AxiosInstance
    save(values: T): Promise<T>
    findAll?(query?: Partial<T>): Promise<T[]>
    findAllPagination(query: Query<T>): Promise<PaginationData<T>>
    findOne(query: Partial<T>): Promise<T>
}

