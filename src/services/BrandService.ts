import { IBrand } from '@/types';
import { AxiosInstance } from 'axios';
import Service, { PaginationData, Query } from './Service';
import http from './http'

export class BrandService implements Service<IBrand> {

    constructor() {
        this.http = http
    }

    http: AxiosInstance;
    async save(values: IBrand): Promise<IBrand> {
        return (await this.http.post('brand', values)).data
    }

    async findAll(): Promise<IBrand[]> {
        return (await this.http.get('brand')).data
    }

    async update(id: string, values: IBrand): Promise<IBrand> {
        throw new Error('Method not implemented.');
    }
    async findAllPagination(query: Query<IBrand>): Promise<PaginationData<IBrand>> {
        throw new Error('Method not implemented.');
    }
    async findOne(query: Partial<IBrand>): Promise<IBrand> {
        throw new Error('Method not implemented.');
    }

}