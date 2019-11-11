from rest_framework import serializers


def calculate_error_percentage(results):
    if len(results) == 0:
        return 0
    errors = 0
    for result in results:
        if result.error_messages:
            errors += 1
    return int(round(errors * 100/len(results)))


# Error Percentage
class ErrorPercentage(object):
    def __init__(self, week, day, hour):
        self.week = week
        self.day = day
        self.hour = hour


# Error Percentage Serializer
class ErrorPercentageSerializer(serializers.Serializer):
    week = serializers.IntegerField()
    day = serializers.IntegerField()
    hour = serializers.IntegerField()
