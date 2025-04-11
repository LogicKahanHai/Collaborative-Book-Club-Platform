from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet,
    ReadingListViewSet,
    ReviewViewSet,
    DiscussionViewSet,
    CommentViewSet,
    MeetingViewSet,
    RegisterView,
    get_csrf_token,
)

router = DefaultRouter()
router.register("books", BookViewSet)
router.register("reading-lists", ReadingListViewSet)
router.register("reviews", ReviewViewSet)
router.register("discussions", DiscussionViewSet)
router.register("comments", CommentViewSet)
router.register("meetings", MeetingViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view(), name="register"),
    path("csrf/", get_csrf_token),
]
