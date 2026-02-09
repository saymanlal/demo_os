from rest_framework.permissions import BasePermission


class IsAdminUserCustom(BasePermission):
    """
    Allows access only to users in Admin or SuperAdmin group.
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        return user.groups.filter(
            name__in=["Admin", "SuperAdmin"]
        ).exists()
