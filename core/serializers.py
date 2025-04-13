from rest_framework import serializers
from .models import User, Book, ReadingList, Review, Discussion, Comment, Meeting
from django.contrib.auth.password_validation import validate_password
from django.db.models import Avg


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "bio", "avatar"]


class BookSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "title", "author", "description", "average_rating"]  # add field

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(avg, 1) if avg else None


class ReadingListSerializer(serializers.ModelSerializer):
    books = serializers.PrimaryKeyRelatedField(many=True, queryset=Book.objects.all())  # type: ignore

    class Meta:
        model = ReadingList
        fields = ["id", "name", "created_at", "books"]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # to show username

    class Meta:
        model = Review
        fields = ["id", "book", "user", "rating", "text", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


class DiscussionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Discussion
        fields = ["id", "book", "user", "text", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"


class MeetingSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False
    )
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Meeting
        fields = [
            "id",
            "book",
            "title",
            "description",
            "date",
            "created_by",
            "participants",
        ]

    def create(self, validated_data):
        participants_data = validated_data.pop("participants", [])
        meeting = Meeting.objects.create(**validated_data)  # type: ignore
        if self.context["request"].user not in participants_data:
            participants_data.append(self.context["request"].user)
        meeting.participants.set(participants_data)
        return meeting


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "password2",
            "bio",
            "avatar",
            "email",
            "first_name",
            "last_name",
        ]
        extra_kwargs = {"bio": {"required": False}, "avatar": {"required": False}}

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user
