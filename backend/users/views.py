
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response

from users.models import Userdata, Friendship
from users.serializers import UserdataSerializer
from utils.mixins import AuditTrailMixin


class UserdataViewSet(AuditTrailMixin, viewsets.ModelViewSet):
	"""
	API endpoint for CRUD actions over user data.

	list:
	Returns a list of all the existing users.

	retrieve:
	Returns the given user.

	create:
	Creates a new user instance.

	update:
	Update a given user instance.

	partial_update:
	Updates a given user instance.

	destroy:
	Deletes a given user instance.
	"""

	serializer_class = UserdataSerializer
	queryset = Userdata.objects.all()


class FriendshipViewSet(
	AuditTrailMixin,
	mixins.CreateModelMixin,
	mixins.ListModelMixin,
	mixins.RetrieveModelMixin,
	mixins.DestroyModelMixin,
	viewsets.GenericViewSet,
):
	"""
	API endpoint for CRUD actions over given user's friends.

	list:
	Returns a list of all user's friends.

	retrieve:
	Returns the given friend.

	create:
	Creates a new friendship connection.

	destroy:
	Deletes a given friendship connection.
	"""

	serializer_class = UserdataSerializer
	audit_trail_label = 'friendship'

	def create(self, request, **kwargs):
		friend = Userdata.objects.get(pk=request.data['id'])
		Userdata.objects.get(pk=kwargs['user_pk']).friends.add(friend)
		return Response(self.serializer_class(friend).data, status=201)

	def destroy(self, request, **kwargs):
		friend = Userdata.objects.get(pk=kwargs['pk'])
		Userdata.objects.get(pk=kwargs['user_pk']).friends.remove(friend)
		return Response({}, status=204)

	def get_queryset(self):
		if self.action == 'list':
			return Userdata.objects.get(pk=self.kwargs['user_pk']).friends.all()
		if self.action == 'retrieve':
			return Userdata.objects.get(pk=self.kwargs['user_pk']).friends.filter(pk=self.kwargs['pk'])
