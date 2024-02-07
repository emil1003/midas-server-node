import { Router } from 'express'
import { accountsRouter } from './account.route.js'
import { currencyRouter } from './currency.route.js'
import { tokenRouter } from './token.route.js'
import { transactionRouter } from './transaction.route.js'
import { userRouter } from './user.route.js'
import { manifestRouter } from './manifest.route.js'

export type Endpoint = {
    basePath: string
    router: Router
}

export const endpoints: Endpoint[] = [
    {
        basePath: '/accounts',
        router: accountsRouter
    },
    {
        basePath: '/user',
        router: userRouter
    },
    {
        basePath: '/currencies',
        router: currencyRouter
    },
    {
        basePath: '/transactions',
        router: transactionRouter
    },
    {
        basePath: '/token',
        router: tokenRouter
    },
    {
        basePath: '/manifest',
        router: manifestRouter
    }
]

