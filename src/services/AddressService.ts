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

    async save(values: IAddress): Promise<IAddress> {
        const { data } = await this.http.post('address', values)
        return data
    }
    async update(id: string, values: IAddress): Promise<IAddress> {
        throw new Error('Method not implemented.')
    }
    async findAllPagination(query: Query<IAddress>): Promise<PaginationData<IAddress>> {
        const { data } = await this.http.get('address', {
            params: query
        })

        return data
    }
    async findOne(query: Partial<IAddress>): Promise<IAddress> {
        const { data } = await this.http.get('address/findOne', {
            params: query
        })
        return data

    }
}