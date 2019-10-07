import schedule
import time


def job():
    print("I'm working")


def job2():
    print("I'm working too")


schedule.every(2).seconds.do(job)
schedule.every(3).seconds.do(job2)

while True:
    schedule.run_pending()
    time.sleep(1)
