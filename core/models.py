from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Extend later with profile fields
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return str(self.username)


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    genre = models.CharField(max_length=50)
    description = models.TextField()
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return str(self.title)


class ReadingList(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reading_lists"
    )
    books = models.ManyToManyField("Book", blank=True, related_name="in_reading_lists")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"{self.name}: ({self.owner.username})")  # type: ignore


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "book"]  # One review per user per book

    def __str__(self):
        return str(f"{self.user.username} on {self.book.title}")  # type: ignore


class Discussion(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="discussions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="discussions")
    title = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"{self.title} by {self.user.username}")  # type: ignore


class Comment(models.Model):
    discussion = models.ForeignKey(
        Discussion, on_delete=models.CASCADE, related_name="comments"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(f"Comment by {self.user.username} on {self.discussion.title}")  # type: ignore


class Meeting(models.Model):
    topic = models.CharField(max_length=200)
    book = models.ForeignKey(
        Book, on_delete=models.SET_NULL, null=True, blank=True, related_name="meetings"
    )
    organizer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="organized_meetings"
    )
    participants = models.ManyToManyField(
        User, related_name="meetings_joined", blank=True
    )
    scheduled_for = models.DateTimeField()

    def __str__(self):
        return str(f"{self.topic} on {self.scheduled_for.strftime('%Y-%m-%d %H:%M')}")  # type: ignore
