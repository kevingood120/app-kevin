import { IProduct } from '@/types';
import { AxiosInstance } from 'axios';
import Service, { PaginationData, Query } from './Service';
import http from './http'

export class ProductService implements Service<IProduct> {
    http: AxiosInstance;

    constructor() {
        this.http = http
    }

    async add(values: IProduct): Promise<IProduct> {
        return (await this.http.post('product', values)).data
    }
    async update(id: string, values: IProduct): Promise<IProduct> {
        return (await this.http.put(`product/${id}`, values)).data
    }
    async findAllPagination(query: Query<IProduct>): Promise<PaginationData<IProduct>> {
        return (await this.http.get('product', { params: query })).data
    }
    findOne(query: Partial<IProduct>): Promise<IProduct> {
        throw new Error('Method not implemented.');
    }

}