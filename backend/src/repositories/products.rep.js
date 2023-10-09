//Capa intermedia entre DAO y SERVICIOS

import dao from "../dao/factory.js"
import ProductDto from "../dto/products.dto.js"
const { Product } = dao
export default class ProductsRepository{
    constructor() {
        this.model = new Product()
    }
    createRep = (data) => {
        let dataDto = new ProductDto(data)
        console.log(dataDto)
        return this.model.createModel(dataDto)
    }
    readRep = (query, options)=> this.model.readModel(query, options)
    readOneRep = (id) => this.model.readOneModel(id)
    updateRep = (id, data) => this.model.updateModel(id, data)
    destroyRep = (data) => this.model.destroyModel(data)
}