import express_jwt_permissions from 'express-jwt-permissions'

export const jwtPermissionsMiddleware = express_jwt_permissions({
    requestProperty: 'auth',
    permissionsProperty: 'scope'
})

