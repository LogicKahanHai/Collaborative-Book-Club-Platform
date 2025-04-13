from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet,
    MeetingDetailView,
    MeetingListCreateView,
    ReadingListViewSet,
    ReviewViewSet,
    DiscussionViewSet,
    CommentViewSet,
    MeetingViewSet,
    RegisterView,
    get_csrf_token,
    current_user,
    custom_login_view,
    custom_logout_view,
)

router = DefaultRouter()
router.register("books", BookViewSet)
router.register(r"reading-lists", ReadingListViewSet)
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"discussions", DiscussionViewSet)
router.register("comments", CommentViewSet)
router.register("meetings", MeetingViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view(), name="register"),
    path("csrf/", get_csrf_token),
    path("user/", current_user),
    path("login/", custom_login_view),
    path("logout/", custom_logout_view),
    path("meetings/", MeetingListCreateView.as_view(), name="meeting-list-create"),
    path("meetings/<int:pk>/", MeetingDetailView.as_view(), name="meeting-detail"),
]
