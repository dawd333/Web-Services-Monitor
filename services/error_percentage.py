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
    def __init__(self, day, week, month):
        self.day = day
        self.week = week
        self.month = month


# Error Percentage Serializer
class ErrorPercentageSerializer(serializers.Serializer):
    day = serializers.IntegerField()
    week = serializers.IntegerField()
    month = serializers.IntegerField()
