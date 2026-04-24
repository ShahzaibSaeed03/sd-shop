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
    CALCULATE: 'orders/calculate',
      CHECK_USER: 'supplier/check-user',
    MY: 'orders/my'
  },
  PRODUCTS: {
  LIST: 'products'
},

  REVIEWS: {
    CREATE: 'reviews',
    GET_BY_PRODUCT: (productId: string) => `reviews/product/${productId}`,
    UPDATE: (id: string) => `reviews/${id}`,
    DELETE: (id: string) => `reviews/${id}`
  }
};