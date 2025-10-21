/* Basic tables */
CREATE TABLE IF NOT EXISTS
    account (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        platform VARCHAR(32) NOT NULL,
        name VARCHAR(128) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        connected BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now ()
    );

CREATE TABLE IF NOT EXISTS
    scheduled_post (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        title VARCHAR(256) NOT NULL,
        platform VARCHAR(32) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        tags TEXT,
        status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now ()
    );

CREATE TABLE IF NOT EXISTS qrtz_job_details (
  sched_name      VARCHAR(120) NOT NULL,
  job_name        VARCHAR(200) NOT NULL,
  job_group       VARCHAR(200) NOT NULL,
  description     VARCHAR(250),
  job_class_name  VARCHAR(250) NOT NULL,
  is_durable      BOOLEAN NOT NULL,
  is_nonconcurrent BOOLEAN NOT NULL,
  is_update_data  BOOLEAN NOT NULL,
  requests_recovery BOOLEAN NOT NULL,
  job_data        BYTEA,
  PRIMARY KEY (sched_name, job_name, job_group)
);

CREATE TABLE IF NOT EXISTS qrtz_triggers  (
  sched_name     VARCHAR(120) NOT NULL,
  trigger_name   VARCHAR(200) NOT NULL,
  trigger_group  VARCHAR(200) NOT NULL,
  job_name       VARCHAR(200) NOT NULL,
  job_group      VARCHAR(200) NOT NULL,
  description    VARCHAR(250),
  next_fire_time BIGINT,
  prev_fire_time BIGINT,
  priority       INTEGER,
  trigger_state  VARCHAR(16) NOT NULL,
  trigger_type   VARCHAR(8) NOT NULL,
  start_time     BIGINT NOT NULL,
  end_time       BIGINT,
  calendar_name  VARCHAR(200),
  misfire_instr  SMALLINT,
  job_data       BYTEA,
  PRIMARY KEY (sched_name, trigger_name, trigger_group)
);

CREATE TABLE IF NOT EXISTS qrtz_simple_triggers (
  sched_name     VARCHAR(120) NOT NULL,
  trigger_name   VARCHAR(200) NOT NULL,
  trigger_group  VARCHAR(200) NOT NULL,
  repeat_count   BIGINT NOT NULL,
  repeat_interval BIGINT NOT NULL,
  times_triggered BIGINT NOT NULL,
  PRIMARY KEY (sched_name, trigger_name, trigger_group),
  FOREIGN KEY (sched_name, trigger_name, trigger_group)
    REFERENCES qrtz_triggers (sched_name, trigger_name, trigger_group)
);

CREATE TABLE IF NOT EXISTS qrtz_cron_triggers(
  sched_name     VARCHAR(120) NOT NULL,
  trigger_name   VARCHAR(200) NOT NULL,
  trigger_group  VARCHAR(200) NOT NULL,
  cron_expression VARCHAR(120) NOT NULL,
  time_zone_id   VARCHAR(80),
  PRIMARY KEY (sched_name, trigger_name, trigger_group),
  FOREIGN KEY (sched_name, trigger_name, trigger_group)
    REFERENCES qrtz_triggers (sched_name, trigger_name, trigger_group)
);

CREATE TABLE IF NOT EXISTS qrtz_calendars (
  sched_name VARCHAR(120) NOT NULL,
  calendar_name VARCHAR(200) NOT NULL,
  calendar BYTEA NOT NULL,
  PRIMARY KEY (sched_name, calendar_name)
);

CREATE INDEX IF NOT EXISTS idx_qrtz_t_nft ON qrtz_triggers (sched_name, next_fire_time);
CREATE INDEX IF NOT EXISTS idx_qrtz_t_state ON qrtz_triggers (sched_name, trigger_state);
CREATE INDEX IF NOT EXISTS idx_qrtz_t_j ON qrtz_triggers (sched_name, job_name, job_group);