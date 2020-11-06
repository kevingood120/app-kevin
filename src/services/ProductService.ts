import { IProduct } from '@/types';
import { AxiosInstance } from 'axios';
import Service, { PaginationData, Query } from './Service';
import http from './http'

export class ProductService implements Service<IProduct> {
    http: AxiosInstance;

    constructor() {
        this.http = http
    }

    async save(values: IProduct): Promise<IProduct> {
        console.log(values)
        return (await this.http.post('product', values)).data
    }
    async findAllPagination(query: Query<IProduct>): Promise<PaginationData<IProduct>> {
        return (await this.http.get('product', { params: query })).data
    }
    async findOne(query: Partial<IProduct>): Promise<IProduct> {
        return (await this.http.get('product/findOne', { params: query })).data
    }

}