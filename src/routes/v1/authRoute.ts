import { Router } from 'express'
import { login,fetch,register } from '../../controller/Auth/authController'
const router = Router()
import { checkJwt } from '../../utils/checkJwt'


router.post('/login', login)
router.post('/register', register)
router.get('/fetch', [checkJwt ,fetch])

export default router
