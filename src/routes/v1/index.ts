import { Router } from 'express'
import SeederRoute from './SeederRoute'



const router = Router()
router.use('/seeder',SeederRoute)


export default router
