from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Import necessary modules and classes

class NoteListCreateView(generics.ListCreateAPIView):
    """
    View to list and create notes for the authenticated user.
    This view inherits from Django REST framework's ListCreateAPIView,
    providing GET and POST methods to list all notes for the authenticated
    user and create a new note, respectively.
    Attributes:
        serializer_class (class): The serializer class used for validating
            and deserializing input, and for serializing output.
        permission_classes (list): The list of permission classes that the
            user must pass to access this view.
    Methods:
        get_queryset(self):
            Returns the queryset of notes filtered by the authenticated user.
        perform_create(self, serializer):
            Saves the new note instance with the authenticated user as the author.
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
            
class NoteDeleteView(generics.DestroyAPIView):
    """
    View to delete a note instance.
    This view inherits from Django REST framework's DestroyAPIView,
    providing a DELETE method to delete a note instance.
    Attributes:
        queryset (QuerySet): The queryset of all notes.
        serializer_class (class): The serializer class used for validating
            and deserializing input, and for serializing output.
        permission_classes (list): The list of permission classes that the
            user must pass to access this view.
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)
    
    

class CreateUserView(generics.CreateAPIView):
    """
    API view to create a new user.

    This view allows any user to create a new user account. It uses the 
    UserSerializer to validate and save the user data.

    Attributes:
        queryset (QuerySet): The queryset that represents all User objects.
        serializer_class (Serializer): The serializer class used to validate and 
                                       save the user data.
        permission_classes (list): The list of permission classes that determine 
                                   who can access this view.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

