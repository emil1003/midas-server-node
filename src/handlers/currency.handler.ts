import { RequestHandler } from "express";

export const handleGetCurrency: RequestHandler = (req, res, _) => {
    res.status(200).json({
        success: true,
        currency: req.currency,
        currencies: req.currencies
    })
}

