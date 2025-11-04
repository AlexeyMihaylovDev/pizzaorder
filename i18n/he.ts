export const he = {
  // Общие
  common: {
    loading: 'טוען...',
    error: 'שגיאה',
    success: 'הצלחה',
    cancel: 'ביטול',
    confirm: 'אישור',
    save: 'שמור',
    delete: 'מחק',
    edit: 'ערוך',
    add: 'הוסף',
    back: 'חזור',
    next: 'הבא',
    finish: 'סיום',
    search: 'חפש',
    continue: 'המשך',
  },

  // Навигация
  nav: {
    home: 'בית',
    menu: 'תפריט',
    cart: 'עגלה',
    orders: 'הזמנות',
    profile: 'פרופיל',
    admin: 'מנהל',
  },

  // Главная
  home: {
    title: 'פיצרייה',
    searchPlaceholder: 'חפש פיצה...',
    empty: 'לא נמצאו פיצות',
  },

  // Пицца
  pizza: {
    addToCart: 'הוספה לעגלה',
    chooseSize: 'בחר גודל',
    size: {
      small: 'קטנה (30 ס"מ)',
      medium: 'בינונית (35 ס"מ)',
      large: 'גדולה (40 ס"מ)',
      family: 'משפחתית (45 ס"מ)',
    },
    chooseToppings: 'בחר תוספות',
    ingredients: 'מרכיבים',
    price: 'מחיר',
    total: 'סה"כ',
    quantity: 'כמות',
  },

  // Топпинги
  toppings: {
    title: 'תוספות',
    extra: 'תוספת',
    choose: 'בחר תוספות',
    categories: {
      cheese: 'גבינות',
      vegetables: 'ירקות',
      meat: 'בשר',
      sauces: 'רטבים',
      spices: 'תבלינים',
    },
    mozzarella: 'מוצרלה',
    cheddar: 'צ\'דר',
    parmesan: 'פארמצ\'ן',
    gorgonzola: 'גורגונזולה',
    ricotta: 'ריקוטה',
    tomatoes: 'עגבניות',
    olives: 'זיתים',
    mushrooms: 'פטריות',
    onions: 'בצל',
    peppers: 'פלפלים',
    pineapple: 'אננס',
    pepperoni: 'פפרוני',
    ham: 'נקניק',
    bacon: 'בייקון',
    chicken: 'עוף',
    ketchup: 'קטשופ',
    garlic: 'שום',
    basil: 'בזיליקום',
    oregano: 'אורגנו',
  },

  // Корзина
  cart: {
    title: 'עגלת קניות',
    empty: 'העגלה ריקה',
    emptyMessage: 'הוסף פיצות לעגלה כדי להמשיך',
    goToMenu: 'עבור לתפריט',
    total: 'סה"כ',
    totalItems: 'פריטים',
    checkout: 'לקופה',
  },

  // Оформление заказа
  checkout: {
    title: 'הזמנה',
    step1: 'פרטי הזמנה',
    step2: 'כתובת משלוח',
    step3: 'תשלום',
    step4: 'אישור',
    orderDetails: 'פרטי ההזמנה',
    deliveryAddress: 'כתובת משלוח',
    paymentMethod: 'אמצעי תשלום',
    confirm: 'אישור הזמנה',
    
    // Адрес
    address: {
      street: 'רחוב',
      streetPlaceholder: 'לדוגמה: הרצל 10',
      city: 'עיר',
      cityPlaceholder: 'לדוגמה: תל אביב',
      zipCode: 'מיקוד',
      zipCodePlaceholder: 'לדוגמה: 61000',
      floor: 'קומה',
      apartment: 'דירה',
      entrance: 'כניסה',
      notes: 'הערות למשלוח',
      notesPlaceholder: 'הוראות נוספות למשלוח...',
    },

    // Способы оплаты
    payment: {
      title: 'בחר אמצעי תשלום',
      cash: 'מזומן',
      card: 'כרטיס אשראי',
      online: 'תשלום מקוון',
      uponDelivery: 'במשלוח',
      cardNumber: 'מספר כרטיס',
      cardExpiry: 'תאריך תפוגה',
      cardCvv: 'CVV',
      cardHolder: 'שם בעל הכרטיס',
    },

    // Контакты
    contact: {
      name: 'שם מלא',
      namePlaceholder: 'הכנס שם מלא',
      phone: 'טלפון',
      phonePlaceholder: '050-1234567',
      email: 'אימייל',
      emailPlaceholder: 'your@email.com',
    },

    placeOrder: 'שלח הזמנה',
    orderPlaced: 'ההזמנה התקבלה!',
    orderNumber: 'מספר הזמנה',
    estimatedTime: 'זמן אספקה משוער',
    minutes: 'דקות',
  },

  // Авторизация
  auth: {
    login: 'התחבר',
    register: 'הרשמה',
    logout: 'התנתק',
    email: 'אימייל',
    password: 'סיסמה',
    name: 'שם',
    alreadyHaveAccount: 'כבר יש לך חשבון?',
    dontHaveAccount: 'אין לך חשבון?',
    loginSuccess: 'התחברת בהצלחה',
    registerSuccess: 'נרשמת בהצלחה',
  },

  // Админ
  admin: {
    title: 'פאנל ניהול',
    orders: 'הזמנות',
    menu: 'ניהול תפריט',
    dashboard: 'לוח בקרה',
    orderStatus: {
      pending: 'ממתין',
      confirmed: 'אושר',
      preparing: 'מוכן',
      ready: 'מוכן למשלוח',
      delivered: 'נמסר',
      cancelled: 'בוטל',
    },
  },

  // Заказы
  orders: {
    title: 'ההזמנות שלי',
    empty: 'אין הזמנות',
    orderNumber: 'מספר הזמנה',
    date: 'תאריך',
    status: 'סטטוס',
    total: 'סה"כ',
    viewDetails: 'צפה בפרטים',
    myOrders: 'ההזמנות שלי',
  },

  // Сообщения
  messages: {
    addedToCart: 'נוסף לעגלה',
    removedFromCart: 'הוסר מהעגלה',
    cartUpdated: 'העגלה עודכנה',
    orderPlaced: 'ההזמנה נשלחה בהצלחה',
    loginRequired: 'נדרש להתחבר',
    fillAllFields: 'אנא מלא את כל השדות',
    invalidEmail: 'אימייל לא תקין',
    errorOccurred: 'אירעה שגיאה',
  },
};

