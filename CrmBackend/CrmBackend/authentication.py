from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class BasicAuthFromCookie(JWTAuthentication):
    def authenticate(self, request):
        jwt_token = request.COOKIES.get('access')
        print(request.path)
        print(jwt_token)
        if jwt_token is not None and request.path != "/api/v1/aaa/login/":
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {jwt_token}'
        return super().authenticate(request)
