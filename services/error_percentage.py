from rest_framework import serializers


# Error Percentage
class ErrorPercentage(object):
    def __init__(self, hour, day, week):
        self.hour = hour
        self.day = day
        self.week = week


# Error Percentage Serializer
class ErrorPercentageSerializer(serializers.Serializer):
    hour = serializers.IntegerField()
    day = serializers.IntegerField()
    week = serializers.IntegerField()