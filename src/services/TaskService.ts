import { ITask } from '@/types';
import { AxiosInstance } from 'axios';
import { params } from 'vee-validate/dist/types/rules/alpha';
import http from './http';
import Service, { PaginationData, Query } from './Service';

export class TaskService implements Service<ITask> {
    http: AxiosInstance;

    constructor() {
        this.http = http
    }

    async add(values: ITask): Promise<ITask> {
        return (await this.http.post('task', values)).data
    }
    update(id: string, values: ITask): Promise<ITask> {
        throw new Error('Method not implemented.');
    }
    findAllPagination(query: Query<ITask>): Promise<PaginationData<ITask>> {
        throw new Error('Method not implemented.');
    }
    async findOne(query: Partial<ITask>): Promise<ITask> {
        return (await this.http.get('task/findOne', { params: query })).data
    }

    async findAll(query: ITask) {
        return (await this.http.get('task', {
            params: {
                desc: query.desc || ''
            }
        })).data
    }

}