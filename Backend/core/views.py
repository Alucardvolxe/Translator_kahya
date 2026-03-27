from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
import os

@api_view(['POST'])
def translate_text(request):
    text = request.data.get('in')
    target_language = request.data.get('lang')
    api_key = os.getenv('API_KEY')
    api_url = os.getenv('API_URL')
    response = requests.post(api_url,headers={'Authorization': f'Bearer {api_key}'}, json={
        'in': text,
        'lang': target_language,
        
    })
    return Response(response.json())
# Create your views here.
