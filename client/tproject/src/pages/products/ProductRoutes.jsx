import { useContext, useEffect, createContext, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { useSnackbar } from 'notistack'
import { validateUser } from '../../functions/user'
import NotFound from '../errors/NotFound'
import ViewProducts from './ViewProducts'
import ViewSingleProduct from './ViewSingleProduct'

export const ProductContext = createContext(null)
function ProductRoutes() {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const [product, setProduct] = useState({
        product_name: "",
        product_category: "",
        product_stock: 0,
        product_description: "",
        product_picture: "",
        product_picture_type: "",
        product_price: 0,
        product_sale: false,
        product_discounted_percent: 0,
        duration_of_pass: 0,
        product_status: true,
    },)

    return (
        <>
            <ProductContext.Provider value={{ product: product, setProduct: setProduct }}>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<ViewProducts />} />
                    <Route path="/:id" element={<ViewSingleProduct />} />
                </Routes>
            </ProductContext.Provider>
        </>
    )
}

export default ProductRoutes