from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Book, Review, ReadingList, Discussion, Comment, Meeting


# @admin.register(User)
# class UserAdmin(BaseUserAdmin):
#     model = User
#     list_display = ("username", "email", "is_staff", "is_superuser")
#     search_fields = ("username", "email")
#     ordering = ("username",)
#     fieldsets = (
#         (None, {"fields": ("username", "password")}),
#         ("Personal info", {"fields": ("bio", "avatar")}),
#         (
#             "Permissions",
#             {
#                 "fields": (
#                     "is_active",
#                     "is_staff",
#                     "is_superuser",
#                     "groups",
#                     "user_permissions",
#                 )
#             },
#         ),
#         ("Important dates", {"fields": ("last_login", "date_joined")}),
#     )
#     add_fieldsets = (
#         (
#             None,
#             {"classes": ("wide",), "fields": ("username", "password1", "password2")},
#         ),
#     )

admin.site.register(User)
admin.site.register(Book)
admin.site.register(Review)
admin.site.register(ReadingList)
admin.site.register(Discussion)
admin.site.register(Comment)
admin.site.register(Meeting)
