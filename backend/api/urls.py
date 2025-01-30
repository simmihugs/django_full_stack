from django.urls import path
from . import views

urlpatterns = [
    path("user/register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change_password"
    ),
    # path('notes/', views.NoteListCreateView.as_view(), name='note-list'),
    # path('notes/delete/<int:pk>/', views.NoteDeleteView.as_view(), name='note-delete'),
]
