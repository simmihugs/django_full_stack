from django.contrib.auth import authenticate, login

# from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import (
    UserSerializer,
    # NoteSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
)

# from .models import Note
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

"""
class NoteListCreateView(generics.ListCreateAPIView):
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
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)
"""


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Generate a random password
        initial_password = "".join(
            random.choices(string.ascii_letters + string.digits, k=10)
        )

        # Create the user with the generated password
        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=initial_password,
        )

        # Send email with initial password
        send_mail(
            "Your Account Password",
            f"Your initial password is: {initial_password}. Please change it after your first login.",
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "User registered successfully. Check your email for the initial password."
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data["identifier"]
        password = serializer.validated_data["password"]

        # Try to authenticate with username
        user = authenticate(username=identifier, password=password)

        # If that fails, try with email
        if user is None:
            try:
                username = User.objects.get(email=identifier).username
                user = authenticate(username=username, password=password)
            except User.DoesNotExist:
                pass

        if user is None:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )

        login(request, user)
        token, _ = Token.objects.get_or_create(user=user)

        response_data = {"token": token.key}

        if user.is_first_login:
            response_data["require_password_change"] = True

        return Response(response_data)


class ChangePasswordView(APIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        new_password = serializer.validated_data["new_password"]

        user.set_password(new_password)
        user.is_first_login = False
        user.save()

        return Response({"message": "Password changed successfully"})
