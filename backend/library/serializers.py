from rest_framework import serializers
from .models import User, StudentProfile, Book, BorrowingRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BorrowingRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.username')
    book_title = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = BorrowingRecord
        fields = ['id', 'student', 'student_name', 'book', 'book_title', 'borrow_date', 'due_date', 'return_date', 'status']