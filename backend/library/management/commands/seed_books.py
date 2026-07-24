import time
import requests
import urllib.parse
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from library.models import Book

class Command(BaseCommand):
    help = 'Seeds the database and generates custom, theme-matching placeholder covers.'

    def handle(self, *args, **kwargs):
        books_data = [
            {"title": "Dune", "author": "Frank Herbert", "isbn": "9780441172719", "genre": "Science Fiction", "copies": 5},
            {"title": "Ender's Game", "author": "Orson Scott Card", "isbn": "9780812550702", "genre": "Science Fiction", "copies": 3},
            {"title": "1984", "author": "George Orwell", "isbn": "9780451524935", "genre": "Dystopian", "copies": 7},
            {"title": "Fahrenheit 451", "author": "Ray Bradbury", "isbn": "9781451673319", "genre": "Dystopian", "copies": 4},
            {"title": "The Hobbit", "author": "J.R.R. Tolkien", "isbn": "9780547928227", "genre": "Fantasy", "copies": 10},
            {"title": "Harry Potter and the Sorcerer's Stone", "author": "J.K. Rowling", "isbn": "9780590353427", "genre": "Fantasy", "copies": 8},
            {"title": "The Name of the Wind", "author": "Patrick Rothfuss", "isbn": "9780756404741", "genre": "Fantasy", "copies": 2},
            {"title": "The Terminal List", "author": "Jack Carr", "isbn": "9781501180812", "genre": "Thriller", "copies": 3},
            {"title": "The Girl with the Dragon Tattoo", "author": "Stieg Larsson", "isbn": "9780307454546", "genre": "Mystery", "copies": 4},
            {"title": "Gone Girl", "author": "Gillian Flynn", "isbn": "9780307588371", "genre": "Thriller", "copies": 5},
            {"title": "Atomic Habits", "author": "James Clear", "isbn": "9780735211292", "genre": "Self-Help", "copies": 6},
            {"title": "Thinking, Fast and Slow", "author": "Daniel Kahneman", "isbn": "9780374533557", "genre": "Psychology", "copies": 3},
            {"title": "The Lean Startup", "author": "Eric Ries", "isbn": "9780307887894", "genre": "Business", "copies": 5},
            {"title": "Sapiens: A Brief History of Humankind", "author": "Yuval Noah Harari", "isbn": "9780062316097", "genre": "History", "copies": 4},
            {"title": "Clean Code", "author": "Robert C. Martin", "isbn": "9780132350884", "genre": "Technology", "copies": 3},
            {"title": "The Pragmatic Programmer", "author": "Andrew Hunt", "isbn": "9780201616224", "genre": "Technology", "copies": 2},
            {"title": "The Book Thief", "author": "Markus Zusak", "isbn": "9780375842207", "genre": "Historical Fiction", "copies": 4},
            {"title": "To Kill a Mockingbird", "author": "Harper Lee", "isbn": "9780060935467", "genre": "Classic", "copies": 8},
            {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "isbn": "9780743273565", "genre": "Classic", "copies": 6},
            {"title": "Pride and Prejudice", "author": "Jane Austen", "isbn": "9781503290563", "genre": "Romance", "copies": 4},
        ]

        for data in books_data:
            book, created = Book.objects.get_or_create(
                isbn=data['isbn'],
                defaults={
                    'title': data['title'],
                    'author': data['author'],
                    'genre': data['genre'],
                    'total_copies': data['copies'],
                    'available_copies': data['copies'],
                }
            )

            if not book.cover_image:
                self.stdout.write(f"Generating custom cover for: {book.title}...")
                
                # Format the text to appear on the image: "Title \n\n Author"
                cover_text = f"{data['title']}\n\n{data['author']}"
                encoded_text = urllib.parse.quote_plus(cover_text)
                
                # Generate a 400x600 image. 
                # Background: 0f172a (React Slate-900), Text: 10b981 (React Emerald-500)
                image_url = f"https://placehold.co/400x600/0f172a/10b981.png?text={encoded_text}"
                
                try:
                    response = requests.get(image_url, timeout=10)
                    
                    if response.status_code == 200:
                        book.cover_image.save(f"{data['isbn']}.png", ContentFile(response.content), save=True)
                        self.stdout.write(self.style.SUCCESS(f"  -> Success!"))
                    else:
                        self.stdout.write(self.style.WARNING(f"  -> Failed to generate image."))
                        
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  -> Error: {e}"))
                
                # A tiny pause just to be safe
                time.sleep(0.5)

        self.stdout.write(self.style.SUCCESS('\nFinished syncing the library catalog!'))