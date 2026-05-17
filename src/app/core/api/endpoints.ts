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

  LIST: 'products',

  BY_CATEGORY: (categoryId: string) =>
    `products/category/${categoryId}`,

  // ✅ ADD THIS
  BY_CATEGORY_SLUG: (slug: string) =>
    `products/category-slug/${slug}`,

  BY_ID: (id: string) =>
    `products/${id}`,

  GAME_INFORMATION: (categoryId: string) =>
    `game-information/${categoryId}`

},

REVIEWS: {

  CREATE: 'reviews',

  GET_BY_CATEGORY: (
    categoryId: string
  ) =>
    `reviews/category/${categoryId}`,

  UPDATE: (id: string) =>
    `reviews/${id}`,

  DELETE: (id: string) =>
    `reviews/${id}`,

  LIKE: (id: string) =>
    `reviews/${id}/like`,

  DISLIKE: (id: string) =>
    `reviews/${id}/dislike`

},

  PAYMENTS: {
    INSTALLMENTS: 'payments/installments'
  }
,
BUNDLES: {

  LIST: 'bundles',

  BY_CATEGORY: (categoryId: string) =>
    `bundles/category/${categoryId}`,

  BY_ID: (id: string) =>
    `bundles/${id}`

},
};