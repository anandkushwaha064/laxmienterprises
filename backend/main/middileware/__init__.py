import json, requests, re, traceback
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.contrib.auth.models import User

class LastUpdatedByMiddleware(MiddlewareMixin):
    def process_request(self, request):
        
        email = request.META.get('HTTP_PROXY_USER',None)
        
        # # Check if the user is authenticated
        if not email:
            return JsonResponse({'error': 'Unauthorized: User is not authenticated'}, status=401)
        try:
            user = User.objects.get(email=email)
            request.user = user
            
        except Exception:
            return JsonResponse({'error': 'Unauthorized: User is not authenticated'}, status=401)
            
        # Apply middleware only for POST, PUT, and PATCH requests
        if request.method in ['POST', 'PUT', 'PATCH']:
            # Ensure the user is authenticated
            # FIXME
            # if request.user.is_authenticated:
            if True:
                try:
                    # Parse the request body
                    if request.content_type == 'application/json':
                        # Decode the JSON body
                        body = json.loads(request.body)
                    else:
                        body = request.POST.copy()

                    # Inject the last_updated_by field with the user's ID
                    # body['last_updated_by'] = request.user.id
                    body['last_updated_by'] = User.objects.all()[0].username

                    # Re-encode the body back into the request
                    if request.content_type == 'application/json':
                        # Update the request's body with the modified JSON
                        request._body = json.dumps(body).encode('utf-8')
                    else:
                        request.POST = body


                except json.JSONDecodeError:
                    return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        return None
