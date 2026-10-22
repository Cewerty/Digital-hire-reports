from dishka import Provider, Scope, provide

from apps.users.services import UserService


class AppProvider(Provider):
    @provide(scope=Scope.REQUEST)
    def provide_user_service(self) -> UserService:
        return UserService()