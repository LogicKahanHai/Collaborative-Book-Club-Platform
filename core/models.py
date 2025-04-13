from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


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
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]  # 1 to 5

    book = models.ForeignKey("Book", on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATING_CHOICES)
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("book", "user")  # Only one review per user per book
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} rated {self.book.title} ({self.rating})"  # type: ignore


class Discussion(models.Model):
    book = models.ForeignKey(
        "Book", on_delete=models.CASCADE, related_name="discussions"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} on {self.book.title}"  # type: ignore


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
    book = models.ForeignKey("Book", on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField()
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True
    )
    participants = models.ManyToManyField(User, related_name="meetings")

    def __str__(self):
        return f"Meeting for {self.book.title} on {self.date}"  # type: ignore

    def is_past(self):
        return self.date < timezone.now()
