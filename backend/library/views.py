import os
from google import genai
from dotenv import load_dotenv
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import User, Book, BorrowingRecord
from .serializers import UserSerializer, BookSerializer, BorrowingRecordSerializer

# --- NEW: CUSTOM ROLE-BASED ACCESS CONTROL SECURITY ---
class IsLibrarianOrAdmin(permissions.BasePermission):
    """
    Allows full read access to anyone authenticated, but strictly restricts
    modifying book catalog properties (Add, Edit, Delete) to Librarians and Admins.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # 1. Anyone logged in can view the library catalog (GET requests)
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # 2. Anyone logged in can access the custom borrow and return actions
        if view.action in ['borrow', 'return_book']:
            return True
            
        # 3. Restrict core management (POSTing new books, deleting) exclusively to Staff
        return request.user.role in ['LIBRARIAN', 'ADMIN']


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # Apply our custom security wall here
    permission_classes = [IsLibrarianOrAdmin]

    @action(detail=True, methods=['post'])
    def borrow(self, request, pk=None):
        book = self.get_object()
        student = request.user

        if book.available_copies <= 0:
            return Response({'error': 'No copies available'}, status=status.HTTP_400_BAD_REQUEST)

        book.available_copies -= 1
        book.save()

        due_date = timezone.now() + timedelta(days=14)
        BorrowingRecord.objects.create(
            student=student,
            book=book,
            due_date=due_date,
            status='ACTIVE'
        )

        return Response({'message': 'Book borrowed successfully!'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='return')
    def return_book(self, request, pk=None):
        book = self.get_object()
        student = request.user

        record = BorrowingRecord.objects.filter(student=student, book=book, status='ACTIVE').first()
        if not record:
            return Response({'error': 'No active borrowing record found for this book.'}, status=status.HTTP_400_BAD_REQUEST)

        book.available_copies += 1
        book.save()

        record.status = 'RETURNED'
        record.return_date = timezone.now()
        record.save()

        return Response({'message': 'Book returned successfully!'}, status=status.HTTP_200_OK)


class BorrowingRecordViewSet(viewsets.ModelViewSet):
    queryset = BorrowingRecord.objects.all()
    serializer_class = BorrowingRecordSerializer
    permission_classes = [IsAuthenticated]

# --- AI RECOMMENDATION ENGINE ---
class AIRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user
        
        history = BorrowingRecord.objects.filter(student=student)
        book_titles = [record.book.title for record in history]

        load_dotenv()
        api_key = os.environ.get("GEMINI_API_KEY")
        
        if not api_key:
            return Response({'error': 'AI API Key is missing on the server.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        client = genai.Client(api_key=api_key)

        if book_titles:
            prompt = f"You are a friendly, expert AI Librarian for ES Kagarama. The student {student.username} has recently borrowed these books: {', '.join(book_titles)}. Based on this specific reading history, write a short, engaging 3-sentence paragraph recommending what genre or themes they should explore next."
        else:
            prompt = f"You are a friendly, expert AI Librarian for ES Kagarama. The student {student.username} hasn't borrowed any books yet. Give them a short, engaging welcome message and recommend 2 classic, must-read books to start their journey."

        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            return Response({'recommendation': response.text}, status=status.HTTP_200_OK)
        except Exception as e:
            print("\n" + "="*50)
            print("🚨 GEMINI API ERROR 🚨")
            print(str(e))
            print("="*50 + "\n")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# --- NEW: CUSTOM LOGIN RESPONSE ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Get the standard tokens
        data = super().validate(attrs)
        
        # Add our custom user role to the response data
        data['role'] = self.user.role 
        
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer