from rest_framework import viewsets, permissions, generics
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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()  # type: ignore
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class ReadingListViewSet(viewsets.ModelViewSet):
    queryset = ReadingList.objects.all()  # type: ignore
    serializer_class = ReadingListSerializer

    def get_queryset(self):
        return ReadingList.objects.filter(owner=self.request.user)  # type: ignore

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.all()  # type: ignore

    def perform_create(self, serializer):
        # Attach current user automatically
        serializer.save(user=self.request.user)


class DiscussionViewSet(viewsets.ModelViewSet):
    serializer_class = DiscussionSerializer
    queryset = Discussion.objects.all()  # type: ignore

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
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


class MeetingListCreateView(generics.ListCreateAPIView):
    queryset = Meeting.objects.all()  # type: ignore
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the user creating the meeting
        serializer.save(created_by=self.request.user)


class MeetingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Meeting.objects.all()  # type: ignore
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
        }
    )


@csrf_exempt
def custom_login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Login successful"}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid method"}, status=405)


@csrf_exempt
def custom_logout_view(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"message": "Logged out successfully"})
    return JsonResponse({"error": "Invalid method"}, status=405)
