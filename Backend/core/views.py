from django.conf import settings
from drf_spectacular.utils import OpenApiExample, extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

from .serializers import (
    SimpleErrorSerializer,
    SupportedLanguagesResponseSerializer,
    TranslateErrorSerializer,
    TranslateSuccessSerializer,
)


def _text_from_translation_payload(payload):
    if isinstance(payload, str):
        return payload
    if isinstance(payload, dict):
        for key in ('out', 'output', 'translation', 'translated', 'text', 'result'):
            val = payload.get(key)
            if val is not None:
                return val if isinstance(val, str) else str(val)
        if len(payload) == 1:
            val = next(iter(payload.values()))
            return val if isinstance(val, str) else str(val) 
    return str(payload)

@extend_schema(
    responses={200: SupportedLanguagesResponseSerializer},
    tags=['Languages'],
)
@api_view(['GET'])
def get_supported_languages(request):
    response = requests.get(settings.API_SUPPORTED_LANGUAGES_URL, headers={'Ocp-Apim-Subscription-Key': settings.PRIMARY_API_KEY})
    response.raise_for_status()
    data = response.json()
    return Response({'languages': data['languages']})

@extend_schema(
    request=inline_serializer(
        name='TranslateRequest',
        fields={
            'in': serializers.CharField(help_text='Text to translate.'),
            'lang': serializers.CharField(
                help_text='Target language pair, e.g. en-gaa (English → Ga).',
            ),
        },
    ),
    responses={
        200: TranslateSuccessSerializer,
        400: SimpleErrorSerializer,
        502: TranslateErrorSerializer,
    },
    examples=[
        OpenApiExample(
            'English to Ga',
            value={'in': 'Hello, how are you?', 'lang': 'en-gaa'},
            request_only=True,
        ),
    ],
    tags=['Translation'],
)
@api_view(['POST'])
def translate_text(request):
    text = request.data.get('in')
    target_language = request.data.get('lang')

    if not text:
        return Response({'error': 'No text provided'}, status=400)

    api_url = settings.API_URL
    keys = [settings.PRIMARY_API_KEY, settings.SECONDARY_API_KEY]

    last_error = None
    

    for key in keys:
        try:
            response = requests.post(
                api_url,
                headers={'Ocp-Apim-Subscription-Key': key},
                json={'in': text, 'lang': target_language},
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return Response({'translated': _text_from_translation_payload(data)})

        except requests.exceptions.HTTPError as e:
            if response.status_code in (401, 403, 429):
                last_error = e
                continue
            return Response({'error': 'Translation failed', 'detail': str(e)}, status=502)

        except requests.exceptions.RequestException as e:
            return Response({'error': 'Translation failed', 'detail': str(e)}, status=502)

    return Response({'error': 'Both API keys failed', 'detail': str(last_error)}, status=502)


    