from pysnmp.hlapi import *

queue = [[ObjectType(ObjectIdentity('1.3.6.1.2.1.1.1.0'))],  # system description
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
         [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.10.1'))],  # interface output octets
         [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.14.1'))],  # interface input errors
         [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.16.1'))],  # interface output octets
         [ObjectType(ObjectIdentity('1.3.6.1.2.1.2.2.1.20.1'))]]  # interface output errors

iteration = getCmd(SnmpEngine(),
                   UsmUserData('test', 'authPass', 'privPass',
                               authProtocol=usmHMACSHAAuthProtocol,
                               privProtocol=usmAesCfb128Protocol),
                   UdpTransportTarget(('192.168.0.220', 161)),
                   ContextData())

next(iteration)

while queue:
    errorIndication, errorStatus, errorIndex, varBinds = iteration.send(queue.pop(0))

    if errorIndication:
        print(errorIndication)
    elif errorStatus:
        print('%s at %s' % (errorStatus.prettyPrint(),
                            errorIndex and varBinds[int(errorIndex) - 1][0] or '?'))
    else:
        for varBind in varBinds:
            print(str(varBind).split("= ", 1)[1])
            print(' = '.join([x.prettyPrint() for x in varBind]))
