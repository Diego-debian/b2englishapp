# Re-exportar todas las funciones principales
from .base import verify_password, get_password_hash
from .user import (
    get_user, get_user_by_username, authenticate_user,
    register_user, update_user_xp, get_user_stats,
    list_verbs_for_user
)
from .verb import (
    get_verbs, get_verb, get_verb_by_infinitive,
    create_verb, update_verb, delete_verb,
    search_verbs, get_verb_stats, bulk_create_verbs
)
from .tense import (
    list_tenses, create_tense, add_tense_example,
    list_examples_by_tense
)
from .activity import (
    list_activities, create_activity, add_activity_question,
    get_activity, list_questions_by_activity,
    start_attempt, submit_answer
)
from .progress import (
    select_verbs_for_practice, update_user_progress,
    get_user_progress, initialize_user_progress,
    list_user_progress
)
from .content import (
    get_published_content_by_slug, list_published_content, count_published_content
)

__all__ = [
    # Base
    "verify_password", "get_password_hash",
    # User
    "get_user", "get_user_by_username", "authenticate_user",
    "register_user", "update_user_xp", "get_user_stats",
    "list_verbs_for_user",
    # Verb
    "get_verbs", "get_verb", "get_verb_by_infinitive",
    "create_verb", "update_verb", "delete_verb",
    "search_verbs", "get_verb_stats", "bulk_create_verbs",
    # Tense
    "list_tenses", "create_tense", "add_tense_example",
    "list_examples_by_tense",
    # Activity
    "list_activities", "create_activity", "add_activity_question",
    "get_activity", "list_questions_by_activity",
    "start_attempt", "submit_answer",
    # Progress
    "select_verbs_for_practice", "update_user_progress",
    "get_user_progress", "initialize_user_progress", "list_user_progress",
    # Content
    "get_published_content_by_slug", "list_published_content", "count_published_content",
]