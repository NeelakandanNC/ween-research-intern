import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    )
}

export const verifyToken = (token) => {
    return jwt.verify(token, config.jwt.secret)
}

export const decodeToken = (token) => {
    return jwt.decode(token)
}
