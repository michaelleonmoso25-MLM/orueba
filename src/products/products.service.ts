import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import asyncForEach = require('../utils/async_foreach');
import storage = require('../utils/cloud_storage');

// Respuesta paginada (mismo formato que usaba nestjs-typeorm-paginate)
export interface Pagination {
    items: Product[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
    links: {
        first: string;
        previous: string;
        next: string;
        last: string;
    };
}

@Injectable()
export class ProductsService {

    constructor(@InjectRepository(Product) private productsRepository: Repository<Product>) {}

    findAll() {
        return this.productsRepository.find();
    }
    
    findByCategory(id_category: number) {
        return this.productsRepository.findBy({ id_category: id_category });
    }

    async paginate(page: number, limit: number, route: string): Promise<Pagination> {
        page = Math.max(page, 1);
        limit = Math.max(limit, 1);

        const [items, totalItems] = await this.productsRepository.findAndCount({
            order: { id: 'ASC' }, // SQL Server necesita un ORDER BY para paginar
            skip: (page - 1) * limit,
            take: limit,
        });
        const totalPages = Math.ceil(totalItems / limit);
        const link = (p: number) => `${route}?page=${p}&limit=${limit}`;

        return {
            items,
            meta: { totalItems, itemCount: items.length, itemsPerPage: limit, totalPages, currentPage: page },
            links: {
                first: link(1),
                previous: page > 1 ? link(page - 1) : '',
                next: page < totalPages ? link(page + 1) : '',
                last: totalPages > 0 ? link(totalPages) : '',
            },
        };
    }

    findByName(name: string) {
        return this.productsRepository.find({ where : { name: Like(`%${name}%`) }})
    }

    async create(files: Array<Express.Multer.File>, product: CreateProductDto) {

        const newProduct = this.productsRepository.create(product);
        const savedProduct = await this.productsRepository.save(newProduct);        

        if (files && files.length > 0) {
            let uploadedFiles = 0; // CONTAR CUANTOS ARCHIVOS SE HAN SUBIDO A FIREBASE
            const startForEach = async () => {
                await asyncForEach(files, async (file: Express.Multer.File) => {
                    const url = await storage(file, file.originalname);

                    if (url !== undefined && url !== null) {
                        if (uploadedFiles === 0) {
                            savedProduct.image1 = url;
                        }
                        else if (uploadedFiles === 1) {
                            savedProduct.image2 = url;
                        }
                    }

                    await this.update(savedProduct.id, savedProduct);
                    uploadedFiles = uploadedFiles + 1;
                    
                });
            };
            await startForEach();
        }

        return savedProduct;
        
    }
    
    async updateWithImages(files: Array<Express.Multer.File>, id: number, product: UpdateProductDto) {

        if (!files || files.length === 0) {
            throw new HttpException("Las imagenes son obligatorias", HttpStatus.BAD_REQUEST);
        }
        if (!product.images_to_update || product.images_to_update.length === 0) {
            throw new HttpException("Indica en images_to_update que imagenes se actualizan (0 = image1, 1 = image2)", HttpStatus.BAD_REQUEST);
        }

        const imagesToUpdate = product.images_to_update;
        let counter = 0;
        let uploadedFiles = Number(imagesToUpdate[counter]); // CONTAR CUANTOS ARCHIVOS SE HAN SUBIDO A FIREBASE

        const updatedProduct = await this.update(id, product);     

        const startForEach = async () => {
            await asyncForEach(files, async (file: Express.Multer.File) => {
                const url = await storage(file, file.originalname);

                if (url !== undefined && url !== null) {
                    if (uploadedFiles === 0) {
                        updatedProduct.image1 = url
                    }
                    else if (uploadedFiles === 1) {
                        updatedProduct.image2 = url
                    }
                }

                await this.update(updatedProduct.id, updatedProduct);
                counter++;
                uploadedFiles = Number(imagesToUpdate[counter]);
                
            })
        }
        await startForEach();
        return updatedProduct;
        
    }

    async update(id: number, product: UpdateProductDto)  {   
 
             
        const productFound = await this.productsRepository.findOneBy({ id: id });
        console.log('Product found: ', productFound);
        
        if (!productFound) {
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND);
        }
        const updatedProduct = Object.assign(productFound, product);
        console.log('Product Updated:', updatedProduct);

        return this.productsRepository.save(updatedProduct);
    }
    
    async delete(id: number)  {
        const productFound = await this.productsRepository.findOneBy({ id: id });
        if (!productFound) {
            throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND);
        }
        return this.productsRepository.delete(id);
    }


}


