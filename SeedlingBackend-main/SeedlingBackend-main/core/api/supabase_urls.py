from django.urls import path

from .supabase_views import SupabaseDocumentView, SupabaseImageView, SupabasePagesView


urlpatterns = [
    path("pages", SupabasePagesView.as_view(), name="supabase-pages"),
    path("pages/", SupabasePagesView.as_view(), name="supabase-pages-slash"),
    path("pages/<int:page_id>/", SupabasePagesView.as_view(), name="supabase-page-detail"),
    path("images/<int:asset_id>/", SupabaseImageView.as_view(), name="supabase-image"),
    path("images/<int:asset_id>", SupabaseImageView.as_view(), name="supabase-image-noslash"),
    path(
        "documents/<int:asset_id>/",
        SupabaseDocumentView.as_view(),
        name="supabase-document",
    ),
    path(
        "documents/<int:asset_id>",
        SupabaseDocumentView.as_view(),
        name="supabase-document-noslash",
    ),
]
