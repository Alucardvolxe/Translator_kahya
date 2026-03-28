"""Serializers used for API documentation (drf-spectacular)."""
from rest_framework import serializers


class TranslateSuccessSerializer(serializers.Serializer):
    translated = serializers.CharField(help_text='Translated text.')


class TranslateErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField(required=False, allow_null=True)


class SimpleErrorSerializer(serializers.Serializer):
    error = serializers.CharField()


class SupportedLanguagesResponseSerializer(serializers.Serializer):
    languages = serializers.JSONField(
        help_text='Supported languages payload from the upstream provider.',
    )
