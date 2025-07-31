import { Router } from 'express'
import { 
    getAllProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../../controller/Admin/producManagement/productController'
import { checkJwt } from '../../utils/checkJwt'


const router = Router()

router.get('/get-all-product', getAllProduct)
router.get('/get-product/:id', getProductById)
router.post('/create-product', [checkJwt,createProduct])
router.put('/update-product/:id', [checkJwt,updateProduct])
router.delete('/delete-product/:id', [checkJwt,deleteProduct])


export default router
