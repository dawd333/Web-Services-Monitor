from rest_framework import serializers
from datetime import datetime, timedelta
import pytz

DATETIME_WEEK = datetime.now(pytz.utc) - timedelta(days=7)
DATETIME_DAY = datetime.now(pytz.utc) - timedelta(days=1)
DATETIME_HOUR = datetime.now(pytz.utc) - timedelta(hours=1)


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
