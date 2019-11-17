from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.executors.pool import ThreadPoolExecutor
from pytz import utc

jobstores = {
    'default': SQLAlchemyJobStore(url='sqlite:///jobs.sqlite')
}
executors = {
    'default': ThreadPoolExecutor(20),
}
job_defaults = {
    'coalesce': False,
    'max_instances': 50
}


class Scheduler:
    def __init__(self):
        self._scheduler = BackgroundScheduler(jobstores=jobstores, executors=executors, job_defaults=job_defaults,
                                              timezone=utc)
        self._scheduler.start()

    def add_job(self, job, interval, args, job_id):
        self._scheduler.add_job(job, 'interval', seconds=interval, args=args, id=job_id, replace_existing=True)

    def job_exists(self, job_id):
        return self._scheduler.get_job(job_id=job_id) is not None

    def remove_job(self, job_id):
        self._scheduler.remove_job(job_id=job_id)


scheduler = Scheduler()


def get_scheduler():
    return scheduler
