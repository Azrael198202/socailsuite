ALTER TABLE account ADD externalid text NULL;
ALTER TABLE account ADD avatarurl text NULL;
ALTER TABLE account ADD handle text NULL;
ALTER TABLE account ADD isdefault bool NULL;
ALTER TABLE account ADD expires_at timestamptz DEFAULT now() NULL;

