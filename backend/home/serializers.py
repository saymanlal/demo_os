from rest_framework import serializers

class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField()

class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField()
    otp = serializers.CharField(min_length=6, max_length=6)

from rest_framework import serializers

class SignupSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField(min_length=6)



class LoginSendOTPSerializer(serializers.Serializer):
    identifier = serializers.CharField()  
    # phone OR email
