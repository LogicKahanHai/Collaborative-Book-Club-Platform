from rest_framework import viewsets, permissions
from .models import Book, ReadingList, Review, Discussion, Comment, Meeting
from .serializers import (
    BookSerializer,
    ReadingListSerializer,
    ReviewSerializer,
    DiscussionSerializer,
    CommentSerializer,
    MeetingSerializer,
    RegisterSerializer,
)
from .permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()  # type: ignore
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class ReadingListViewSet(viewsets.ModelViewSet):
    queryset = ReadingList.objects.all()  # type: ignore
    serializer_class = ReadingListSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()  # type: ignore
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DiscussionViewSet(viewsets.ModelViewSet):
    queryset = Discussion.objects.all()  # type: ignore
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()  # type: ignore
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()  # type: ignore
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"csrfToken": request.META.get("CSRF_COOKIE")})
