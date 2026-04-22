export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    GOOGLE: 'auth/google',
    MAKE_ADMIN: (id: string) => `auth/make-admin/${id}`
  },
  BANNER: {
    LIST: 'banners'
  },
  SECTIONS: {
    FRONTEND: 'sections/frontend'
  },
  COUPON: {
    APPLY: 'coupons/apply',
    LIST: 'coupon',
    GET_ONE: (id: string) => `coupon/${id}`
  },
  ORDERS: {
    CREATE: 'orders',
    CALCULATE: 'orders/calculate'
  },
  PRODUCTS: {
  LIST: 'products'
}
};