export interface INavLink {
    title: string
    to: string
    icon: string
    items?: INavLink[]
}

export interface IAddress {
    id?: string
    zipcode: string
    city: string
    neighborhood: string
    state: string
    street: string
}

export interface ICustomer {
    id?: string
    name: string
    email: string
    tel: string
    cel: string
    cpf: string
    addressNumber: string
    comments: string
    complement: string
    address: IAddress
    createdAt: Date
}

export interface IBrand {
    id?: string
    desc: string
}

export interface IProductGroup {
    id?: string
    desc: string
}

export interface IProduct {
    id?: string
    desc: string
    stock: number
    minStock: number
    unit: number
    brand?: IBrand
    productGroup?: IProductGroup
    purchasePrice: number
    salePrice: number
    createdAt: Date
}

export interface ITask {
    id?: string
    desc: string
    price: number
}


export const Units = ['Unidade', 'Kilograma', 'Litro', 'Caixa', 'M²', 'Outro'].map((value, i) => ({
    text: value,
    value: i
}))

