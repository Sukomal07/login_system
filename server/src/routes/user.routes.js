import express from 'express'
import { deleteAccount, getProfile, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', upload.single("avatar"), registerUser)
router.post('/login', loginUser)
router.post('/logout', verifyJWT, logoutUser)
router.get('/profile', verifyJWT, getProfile)
router.delete('/delete-profile', verifyJWT, deleteAccount)

export default router