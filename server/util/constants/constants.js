var HTTP_STATUS = {
    MSG_200: 'Success',
    MSG_201: 'Created',
    MSG_400: 'Bad Request',
    MSG_404: 'Not Found',
    MSG_500: 'Internal Server Error',
    MSG_403: 'Forbidden',
    MSG_401: 'Unauthorized'
};

var AUTH_URIS = {
    'LOGIN_BASE': '/auth/login',
    'SIGNUP_BASE': '/auth/signup',
    'LOGOUT_BASE': '/auth/logout'
};

exports.HTTP_STATUS = HTTP_STATUS;