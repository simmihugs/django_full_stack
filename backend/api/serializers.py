# from django.contrib.auth.models import User
from rest_framework import serializers

# from .models import Note
from .models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        extra_kwargs = {"email": {"required": True}}

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, write_only=True)
