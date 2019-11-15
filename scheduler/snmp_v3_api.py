from pysnmp.hlapi import *
from .scheduler import get_scheduler
from django.utils.ipv6 import is_valid_ipv6_address
from snmp_v3.models import PlatformChoices, SnmpConfiguration, SnmpResults

scheduler = get_scheduler()

linux_test_requests = [[ObjectType(ObjectIdentity('1.3.6.1.2.1.1.1.0'))],  # system description
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.1.3.0'))],  # system uptime
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.10.1.3.1'))],  # 1 min load
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.11.9.0'))],  # %cpu user
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.6.0'))],  # used ram
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.9.1.9.1'))],  # % used space on disk
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.10.1'))]]  # interface input octets

linux_full_requests = [[ObjectType(ObjectIdentity('1.3.6.1.2.1.1.1.0'))],  # system description
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.1.3.0'))],  # system uptime
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.25.1.5.0'))],  # number of users in system
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.25.1.6.0'))],  # number of processes running
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.10.1.3.1'))],  # 1 min load
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.10.1.3.2'))],  # 5 min load
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.10.1.3.3'))],  # 15 min load
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.11.9.0'))],  # %cpu user
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.11.10.0'))],  # %cpu system
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.11.11.0'))],  # %cpu idle
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.3.0'))],  # total swap size
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.4.0'))],  # available swap space
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.5.0'))],  # total ram
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.6.0'))],  # used ram
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.11.0'))],  # free ram
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.13.0'))],  # shared ram
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.14.0'))],  # buffered ram
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.4.15.0'))],  # cached memory
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.9.1.6.1'))],  # total size of disk(kBytes)
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.9.1.7.1'))],  # available space on disk
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.9.1.8.1'))],  # used space on disk
                       [ObjectType(ObjectIdentity('1.3.6.1.4.1.2021.9.1.9.1'))],  # % used space on disk
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.10.1'))],  # interface input octets
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.14.1'))],  # interface input errors
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.16.1'))],  # interface output octets
                       [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.20.1'))]]  # interface output errors


def get_command_ipv4(username, authentication_password, privacy_password, ipv4):
    return getCmd(SnmpEngine(),
                  UsmUserData(username, authentication_password, privacy_password,
                              authProtocol=usmHMACSHAAuthProtocol,
                              privProtocol=usmAesCfb128Protocol),
                  UdpTransportTarget((ipv4, 161)),
                  ContextData())


def get_command_ipv6(username, authentication_password, privacy_password, ipv6):
    return getCmd(SnmpEngine(),
                  UsmUserData(username, authentication_password, privacy_password,
                              authProtocol=usmHMACSHAAuthProtocol,
                              privProtocol=usmAesCfb128Protocol),
                  Udp6TransportTarget((ipv6, 161)),
                  ContextData())


def is_test_request_valid(snmp_configuration):
    if is_valid_ipv6_address(snmp_configuration.ip):
        get_command = get_command_ipv6(snmp_configuration.username, snmp_configuration.authentication_password,
                                       snmp_configuration.privacy_password, snmp_configuration.ip)
    else:
        get_command = get_command_ipv4(snmp_configuration.username, snmp_configuration.authentication_password,
                                       snmp_configuration.privacy_password, snmp_configuration.ip)

    next(get_command)

    if snmp_configuration.platform == PlatformChoices.get_value('Linux'):
        linux_full_requests_copy = linux_test_requests.copy()
        while linux_full_requests_copy:
            error_indication, error_status, _, _ = get_command.send(linux_full_requests_copy.pop(0))
            if error_indication:
                return False
            elif error_status:
                return False
    return True


def snmp_job(snmp_configuration):
    if is_valid_ipv6_address(snmp_configuration.ip):
        get_command = get_command_ipv6(snmp_configuration.username, snmp_configuration.authentication_password,
                                       snmp_configuration.privacy_password, snmp_configuration.ip)
    else:
        get_command = get_command_ipv4(snmp_configuration.username, snmp_configuration.authentication_password,
                                       snmp_configuration.privacy_password, snmp_configuration.ip)

    next(get_command)
    results = []
    error_messages = []

    if snmp_configuration.platform == PlatformChoices.get_value('Linux'):
        linux_full_requests_copy = linux_full_requests.copy()
        while linux_full_requests_copy:
            error_indication, error_status, error_index, var_binds = get_command.send(linux_full_requests_copy.pop(0))

            if error_indication:
                if error_indication not in error_messages:
                    error_messages.append(error_indication)
            elif error_status:
                error_messages.append('%s at %s' % (error_status.prettyPrint(),
                                                    error_index and var_binds[int(error_index) - 1][0] or '?'))
            else:
                for var_bind in var_binds:
                    results.append(str(var_bind).split("= ", 1)[1])

    SnmpResults.objects.create(snmp_configuration=snmp_configuration, results=results, error_messages=error_messages)


def start():
    snmp_configurations = SnmpConfiguration.objects.all()
    for snmp_configuration in snmp_configurations:
        job_id = "snmp_" + str(snmp_configuration.id)
        if snmp_configuration.is_active:
            scheduler.add_job(job=snmp_job, interval=snmp_configuration.interval, args=(snmp_configuration,),
                              job_id=job_id)
        else:
            if scheduler.job_exists(job_id=job_id):
                scheduler.remove_job(job_id=job_id)


def add_or_update(snmp_configuration):
    job_id = "snmp_" + str(snmp_configuration.id)
    if snmp_configuration.is_active:
        scheduler.add_job(job=snmp_job, interval=snmp_configuration.interval, args=(snmp_configuration,), job_id=job_id)
    else:
        if scheduler.job_exists(job_id=job_id):
            scheduler.remove_job(job_id=job_id)


def remove(snmp_configuration_id):
    job_id = "snmp_" + str(snmp_configuration_id)
    if scheduler.job_exists(job_id=job_id):
        scheduler.remove_job(job_id=job_id)
