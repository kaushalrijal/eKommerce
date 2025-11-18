export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'eKommerce'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern ecommerce store built with Next.js'
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT || 4);

export const signInDefaultValues = {
    email: 'god@kaushal.com', 
    password: 'iamthegreat'
}

export const signUpDefaultValues = {
    name: '',
    email: '', 
    password: '',
    confirmPassword: '',
}

export const shippingAddressDefaultValues = {
    fullName: "John Doe",
    streetAddress: '123 Ghar',
    city: "taltira",
    potalCode: '69420',
    country: "ekadesh"
}