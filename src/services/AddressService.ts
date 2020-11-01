import Service, { PaginationData, Query } from './Service'
import {
    IAddress
} from '@/types'
import { AxiosInstance } from 'axios'
import http from './http'

export class AddressService implements Service<IAddress> {

    constructor () {
        this.http = http
    }

    http: AxiosInstance

    async add(values: IAddress): Promise<IAddress> {
        const { data } = await this.http.post('address', values)
        return data
    }
    async update(id: string, values: IAddress): Promise<IAddress> {
        throw new Error('Method not implemented.')
    }
    async findAllPagination(query: Query<IAddress>): Promise<PaginationData<IAddress>> {
        throw new Error('Method not implemented.')
    }
    async findOne(query: Partial<IAddress>): Promise<IAddress> {
        const { data, config } = await this.http.get('address/filter', {
            params: query
        })

        console.log(config.baseURL)
        return data

    }
}