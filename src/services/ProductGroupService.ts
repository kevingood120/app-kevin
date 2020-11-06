import { IProductGroup } from '@/types';
import { AxiosInstance } from 'axios';
import http from './http';
import Service, { PaginationData, Query } from './Service';

export class ProductGroupService implements Service<IProductGroup> {
    http: AxiosInstance;
    constructor() {
        this.http = http
    }
    save(values: IProductGroup): Promise<IProductGroup> {
        throw new Error('Method not implemented.');
    }
    update(id: string, values: IProductGroup): Promise<IProductGroup> {
        throw new Error('Method not implemented.');
    }
    findAllPagination(query: Query<IProductGroup>): Promise<PaginationData<IProductGroup>> {
        throw new Error('Method not implemented.');
    }
    findOne(query: Partial<IProductGroup>): Promise<IProductGroup> {
        throw new Error('Method not implemented.');
    }

    async findAll(query?: Partial<IProductGroup>): Promise<IProductGroup[]> {
        return (await this.http.get('/product-group', { params: query })).data
    }

}