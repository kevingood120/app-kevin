import { AxiosInstance, AxiosStatic } from 'axios';
import { ICustomer } from '@/types';
import Service, { PaginationData, Query } from './Service';
import http from './http'

export class CustomerService implements Service<ICustomer> {
    http: AxiosInstance

    constructor() {
        this.http = http
    }

    async findAllPagination(query: Query<ICustomer>): Promise<PaginationData<ICustomer>> {
        const response = await this.http.get<PaginationData<ICustomer>>('/customer', {
            params: query
        })

        return response.data
    }
    
    async add(values: ICustomer): Promise<ICustomer> {
        const response = await this.http.post<ICustomer>('/customer', values)
        return response.data
    }

    async update(id: string, values: ICustomer): Promise<ICustomer> {
        const response = await this.http.put<ICustomer>(`/customer/${id}`, values)
        return response.data
    }

    async findOne(query: Partial<ICustomer>): Promise<ICustomer> {
        const response = await this.http.get<ICustomer>('/customer/findOne', {
            params: query
        })
        
        return response.data || null
    }
    
}