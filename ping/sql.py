def get_ping_results_query_20minutes_with_user(ping_configuration, user, from_date, to_date):
    return """
            DROP AGGREGATE IF EXISTS array_accum (anyarray);
            CREATE AGGREGATE array_accum (anyarray)
            (
                sfunc = array_cat,
                stype = anyarray,
                initcond = '{}'
            );
            
            SELECT (SELECT last_value from ping_pingresults_id_seq) AS id,
                    (SELECT (date_trunc('hour', pr.created_at) + floor(extract(minute from pr.created_at) / 20 ) * interval '20 minute')) AS created_at,
                    SUM(pr.number_of_requests) AS number_of_requests,
                    array_accum(error_messages) AS error_messages,
                    AVG(rtt_avg_ms) AS rtt_avg_ms
            FROM ping_pingresults pr JOIN ping_pingconfiguration pp on pr.ping_configuration_id = pp.id
            JOIN services_service ss on pp.service_id = ss.id JOIN auth_user au on ss.owner_id = au.id
            WHERE pr.ping_configuration_id = %s AND (au.username = '%s' OR au.username = '%s') AND
                  pr.created_at >= '%s' AND pr.created_at < '%s'
            GROUP BY 2
            ORDER BY 2
            """ % (ping_configuration, user, user, from_date, to_date)


def get_ping_results_query_day_with_user(ping_configuration, user, from_date, to_date):
    return """
            DROP AGGREGATE IF EXISTS array_accum (anyarray);
            CREATE AGGREGATE array_accum (anyarray)
            (
                sfunc = array_cat,
                stype = anyarray,
                initcond = '{}'
            );
            
            SELECT (SELECT last_value from ping_pingresults_id_seq) AS id,
                    date_trunc('day', pr.created_at) AS created_at,
                    SUM(pr.number_of_requests) AS number_of_requests,
                    array_accum(error_messages) AS error_messages,
                    AVG(rtt_avg_ms) AS rtt_avg_ms
            FROM ping_pingresults pr JOIN ping_pingconfiguration pp on pr.ping_configuration_id = pp.id
            JOIN services_service ss on pp.service_id = ss.id JOIN auth_user au on ss.owner_id = au.id
            WHERE pr.ping_configuration_id = %s AND (au.username = '%s' OR au.username = '%s') AND
                  pr.created_at >= '%s' AND pr.created_at < '%s'
            GROUP BY 2
            ORDER BY 2
            """ % (ping_configuration, user, user, from_date, to_date)


def get_ping_results_query_status_page(ping_configuration, from_date):
    return """
            DROP AGGREGATE IF EXISTS array_accum (anyarray);
            CREATE AGGREGATE array_accum (anyarray)
            (
                sfunc = array_cat,
                stype = anyarray,
                initcond = '{}'
            );

            SELECT (SELECT last_value from ping_pingresults_id_seq) AS id,
                    (SELECT (date_trunc('hour', pr.created_at) + floor(extract(minute from pr.created_at) / 20 ) * interval '20 minute')) AS created_at,
                    SUM(pr.number_of_requests) AS number_of_requests,
                    array_accum(error_messages) AS error_messages,
                    AVG(rtt_avg_ms) AS rtt_avg_ms
            FROM ping_pingresults pr JOIN ping_pingconfiguration pp on pr.ping_configuration_id = pp.id
            WHERE pr.ping_configuration_id = %s AND pr.created_at >= '%s'
            GROUP BY 2
            ORDER BY 2
            """ % (ping_configuration, from_date)
