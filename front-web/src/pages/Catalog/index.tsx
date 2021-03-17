import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveTypeReferenceDirective } from 'typescript';
import { ProductsResponse } from 'core/types/Product';
import { makeRequest } from 'core/utils/request';
import ProductCard from './components/ProductCard';
import ProductCardLoader from './components/Loaders/ProductCardLoader';
import Pagination from 'core/components/Paginations';
import './styles.scss';
const Catalog = () =>{
    //Quando a lista de produtos estiver disponível,
    // Popular um estado no componente, e listar os produtos dinâmicamente
    const [productsResponse, setProdctsResponse] = useState<ProductsResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    // Quando o componente iniciar, buscar a lista  de produtos
    useEffect(() => {   
        const params = {
            page: activePage,
            linesPerPage: 12,
        }
        //requisições usando fetch tem suas limitações e é muito verboso.
        //não possui suporte nativo para ler um progresso de upload de arquivo.
        //não tem suporte nativo para enviar query strings.

        // iniciar o loader
        setIsLoading(true);
        makeRequest({url:'/products',params})
        .then(response => setProdctsResponse(response.data))
        .finally(() => {
        // finalizar o loader
        setIsLoading(false);
        })
    },[activePage]);
    return (
    <div className="catalog-container">
        <h1 className="catalog-title">
            Catálogo de Produtos
        </h1>
        <div className="catalog-products">
            {isLoading ? <ProductCardLoader /> : (
                productsResponse?.content.map(product =>(
                    <Link to={`/products/${product.id}`} key={product.id}>
                        <ProductCard product={product}/>
                        </Link>
                        )
                    )
            )}
        </div>
        {productsResponse && (
             <Pagination 
             totalPages={productsResponse?.totalPages}
             activePage={activePage}
             onChange= {page => setActivePage(page) }
             />
        )}
    </div>
)};
export default Catalog;