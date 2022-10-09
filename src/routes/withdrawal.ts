import { Router } from 'express'
import { withdrawal,getAllWithdrawals, getAllUserWithdrawals } from '../controller/withdrawal'
import { auth } from '../middleware/auth'

const router = Router()

router.get('/allWithdrawals', getAllWithdrawals)
router.get('/getAllUserWithdrawals',auth, getAllUserWithdrawals)
router.post('/withdraw',auth, withdrawal)

export default router