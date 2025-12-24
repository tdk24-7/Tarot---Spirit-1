Table achievements {
  id integer [pk, increment]
  name varchar(100) [not null]
  description text
  badge_url varchar(255) [default: null]
  achievement_type enum('reading', 'forum', 'login', 'premium', 'general') [not null]
  points integer [default: 0]
  created_at datetime [default: `CURRENT_TIMESTAMP`]
}

Table admin_reports {
  id integer [pk, increment]
  report_type varchar(100) [not null]
  content text
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  related_user_id integer
  related_post_id integer
  related_comment_id integer

  Indexes {
    report_type [name: 'idx_report_type']
    related_user_id [name: 'fk_admin_reports_user']
    related_post_id [name: 'fk_admin_reports_post']
    related_comment_id [name: 'fk_admin_reports_comment']
  }
}

Table daily_journals {
  id integer [pk, increment]
  user_id integer [not null]
  content text
  date date [not null]
  created_at datetime [default: `CURRENT_TIMESTAMP`]

  Indexes {
    user_id [name: 'user_id']
    date [name: 'idx_date']
  }
}

Table daily_tarot_messages {
  id integer [pk, increment]
  date date [not null]
  card_id integer [not null]
  message text
  type enum('daily', 'weekly') [default: 'daily']

  Indexes {
    (date, type) [unique, name: 'unique_date_type']
    date [name: 'idx_date']
    card_id [name: 'idx_card_id']
  }
}

Table forum_comments {
  id integer [pk, increment]
  post_id integer [not null]
  user_id integer [not null]
  comment text [not null]
  created_at datetime [default: `CURRENT_TIMESTAMP`]

  Indexes {
    post_id [name: 'post_id']
    user_id [name: 'user_id']
  }
}

Table forum_posts {
  id integer [pk, increment]
  user_id integer [not null]
  title varchar(255) [not null]
  content text
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]

  Indexes {
    user_id [name: 'user_id']
    title [name: 'idx_title']
  }
}

Table payments {
  id integer [pk, increment]
  user_id integer [not null]
  app_trans_id varchar(50) [default: null]
  amount decimal(10,2) [not null]
  currency varchar(10) [default: 'VND']
  status enum('pending', 'completed', 'failed') [default: 'pending']
  transaction_id varchar(100) [default: null]
  payment_method varchar(50) [default: null]
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]

  Indexes {
    user_id [name: 'user_id']
    transaction_id [name: 'idx_transaction_id']
    status [name: 'idx_status']
  }
}

Table reading_cards {
  id integer [pk, increment]
  reading_id integer [not null]
  card_id integer [not null]
  position_in_spread integer [not null]
  is_reversed boolean [default: null]
  interpretation text
  interpretation_source enum('Normal', 'AI') [default: 'Normal']

  Indexes {
    reading_id [name: 'reading_id']
    card_id [name: 'card_id']
  }
}

Table social_auth {
  id integer [pk, increment]
  user_id integer [not null]
  provider varchar(20) [not null]
  provider_id varchar(255) [not null]
  provider_email varchar(100) [default: null]
  access_data json [default: null]
  created_at datetime [default: null]
  updated_at datetime [default: null]

  Indexes {
    (user_id, provider) [unique, name: 'unique_user_provider']
    (provider, provider_id) [unique, name: 'unique_provider_id']
    user_id [name: 'social_auth_user_id']
  }
}

Table tarot_card_meanings {
  id integer [pk, increment]
  card_id integer [not null]
  topic_id integer [not null]
  upright_meaning text
  reversed_meaning text
  created_at datetime [default: `CURRENT_TIMESTAMP`]

  Indexes {
    (card_id, topic_id) [unique, name: 'unique_card_topic']
    topic_id [name: 'topic_id']
  }
}

Table tarot_cards {
  id integer [pk, increment]
  name varchar(50) [not null]
  type enum('Major', 'Minor') [not null]
  suit varchar(20)
  number integer
  image_url varchar(255)
  description text
  general_meaning text
  reversed_meaning text
  keywords text
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
}

Table tarot_readings {
  id integer [pk, increment]
  user_id integer
  topic_id integer [not null]
  spread_id integer [not null]
  question text
  created_at datetime [default: `CURRENT_TIMESTAMP`]

  Indexes {
    user_id [name: 'user_id']
    topic_id [name: 'topic_id']
    spread_id [name: 'spread_id']
  }
}

Table tarot_spreads {
  id integer [pk, increment]
  name varchar(100) [not null, unique]
  description text
  position_labels json
  number_of_cards integer [not null]

  Indexes {
    name [name: 'idx_name']
  }
}

Table tarot_topics {
  id integer [pk, increment]
  name varchar(100) [not null, unique]
  description text

  Indexes {
    name [name: 'idx_name']
  }
}

Table user_achievements {
  id integer [pk, increment]
  user_id integer [not null]
  achievement_id integer [not null]
  achieved_at datetime [default: `CURRENT_TIMESTAMP`]

  Indexes {
    (user_id, achievement_id) [unique, name: 'unique_user_achievement']
    achievement_id [name: 'achievement_id']
  }
}

Table user_profiles {
  id integer [pk, increment]
  user_id integer [not null, unique]
  full_name varchar(100)
  phone_number varchar(20)
  birth_date date
  bio text
  created_at datetime
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
  country varchar(50)
  city varchar(50)
  avatar_url varchar(255)
}

Table user_ranks {
  id integer [pk, increment]
  name varchar(50) [not null, unique]
  description text
  min_points integer [not null, default: 0]
  created_at datetime
  badge_image varchar(255)
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
}

Table user_sessions {
  id integer [pk, increment]
  user_id integer [not null]
  token varchar(255) [not null]
  expires_at datetime [not null]
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  last_activity datetime [default: `CURRENT_TIMESTAMP`]
  ip_address varchar(45)
  user_agent varchar(255)

  Indexes {
    user_id [name: 'idx_user_id']
    token [name: 'idx_token']
  }
}

Table user_stats {
  id integer [pk, increment]
  user_id integer [not null, unique]
  readings_count integer [default: 0]
  forum_posts_count integer [default: 0]
  forum_comments_count integer [default: 0]
  last_reading_date datetime
  created_at datetime
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
}

Table users {
  id integer [pk, increment]
  username varchar(100) [not null, unique]
  email varchar(100) [not null, unique]
  password_hash varchar(255) [not null]
  role enum('user', 'admin') [default: 'user']
  is_premium boolean [default: 0]
  created_at datetime [not null]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
  rank_id integer
  points integer [default: 0]
  last_login datetime
  premium_until datetime

  Indexes {
    username [name: 'idx_username']
    email [name: 'idx_email']
    rank_id [name: 'rank_id']
    role [name: 'idx_role']
    is_premium [name: 'idx_is_premium']
  }
}

Ref: admin_reports.related_user_id > users.id [delete: set null]
Ref: admin_reports.related_post_id > forum_posts.id [delete: set null]
Ref: admin_reports.related_comment_id > forum_comments.id [delete: set null]
Ref: daily_journals.user_id > users.id [delete: cascade]
Ref: daily_tarot_messages.card_id > tarot_cards.id [delete: restrict, update: cascade]
Ref: forum_comments.post_id > forum_posts.id [delete: cascade]
Ref: forum_comments.user_id > users.id [delete: cascade]
Ref: payments.user_id > users.id [delete: cascade]
Ref: reading_cards.reading_id > tarot_readings.id [delete: cascade]
Ref: reading_cards.card_id > tarot_cards.id [delete: cascade]
Ref: social_auth.user_id > users.id [delete: cascade, update: cascade]
Ref: tarot_card_meanings.card_id > tarot_cards.id [delete: cascade]
Ref: tarot_card_meanings.topic_id > tarot_topics.id [delete: cascade]
Ref: tarot_readings.user_id > users.id [delete: cascade]
Ref: tarot_readings.topic_id > tarot_topics.id [delete: cascade]
Ref: tarot_readings.spread_id > tarot_spreads.id [delete: cascade]
Ref: user_achievements.user_id > users.id [delete: cascade]
Ref: user_achievements.achievement_id > achievements.id [delete: cascade]
Ref: user_profiles.user_id > users.id [delete: cascade, update: cascade]
Ref: user_sessions.user_id > users.id [delete: cascade]
Ref: user_stats.user_id > users.id [delete: cascade, update: cascade]
Ref: users.rank_id > user_ranks.id [delete: set null, update: cascade]