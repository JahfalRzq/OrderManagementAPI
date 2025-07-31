import { Router } from 'express'
import SeederRoute from './seederRoute'
import AuthRoute from './authRoute'
import ProductRoute from './productRoute'





const router = Router()
router.use('/seeder',SeederRoute)
router.use('/auth',AuthRoute)
router.use('/product',ProductRoute)




export default router
