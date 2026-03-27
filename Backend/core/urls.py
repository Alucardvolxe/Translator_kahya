from django.urls import path
from .views import translate_text, get_supported_languages

urlpatterns = [
    path('translate/', translate_text, name='translate_text'),
    path('supported-languages/', get_supported_languages, name='get_supported_languages'),
]
