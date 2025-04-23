from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission: only allow owners to edit/delete; others can read.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS: GET, HEAD, OPTIONS (read-only)
        if request.method in permissions.SAFE_METHODS:
            return True

        print(obj.created_by, request.user)

        # Write permissions only for the owner
        return (
            obj.created_by == request.user
            or obj.user == request.user
            or obj.organizer == request.user
        )
