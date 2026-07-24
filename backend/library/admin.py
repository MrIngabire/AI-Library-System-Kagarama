from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Book, BorrowingRecord, StudentProfile

# This tells the admin panel to use the secure password hasher and include your custom roles
class CustomUserAdmin(UserAdmin):
    model = User
    fieldsets = UserAdmin.fieldsets + (
        ('Library Role', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Library Role', {'fields': ('role',)}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Book)
admin.site.register(BorrowingRecord)
admin.site.register(StudentProfile)