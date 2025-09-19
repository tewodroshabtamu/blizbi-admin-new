import { useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/supabase-client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useBookmarks = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Get or create user profile (cached)
  const ensureUserProfile = async (): Promise<string | null> => {
    if (!user) return null;

    // Check cache first
    const cachedProfileId = queryClient.getQueryData(["user-profile", user.id]);
    if (cachedProfileId) {
      return cachedProfileId as string;
    }

    try {
      // First try to get existing profile
      let { data: profile, error: selectError } = await supabase
        .from("profiles")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      // Create profile if it doesn't exist
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([{ clerk_id: user.id }])
          .select("id")
          .single();

        if (insertError) {
          throw insertError;
        }

        profile = newProfile;
      } else if (selectError) {
        throw selectError;
      }

      const profileId = profile?.id || null;

      // Cache the profile ID
      if (profileId) {
        queryClient.setQueryData(["user-profile", user.id], profileId);
      }

      return profileId;
    } catch (error) {
      console.error("Profile creation error:", error);
      return null;
    }
  };

  // Query to load user's bookmarked event IDs (optimized)
  const { data: userBookmarks = [] } = useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const profileId = await ensureUserProfile();
      if (!profileId) return [];

      const { data, error } = await supabase
        .from("bookmarks")
        .select("event_id")
        .eq("profile_id", profileId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Derive bookmarked events set from query data - no useState needed
  const bookmarkedEvents = useMemo(() => {
    return new Set(userBookmarks.map((bookmark) => bookmark.event_id));
  }, [userBookmarks]);

  // Check if an event is bookmarked
  const isBookmarked = (eventId: string) => {
    return bookmarkedEvents.has(eventId);
  };

  // Query to get bookmarked events with full details (only when needed)
  const {
    data: bookmarkedEventsDetails = [],
    refetch: refetchBookmarkedEvents,
    isLoading: bookmarkedEventsLoading,
  } = useQuery({
    queryKey: ["bookmarked-events-details", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const profileId = await ensureUserProfile();
      if (!profileId) return [];

      const { data, error } = await supabase
        .from("bookmarks")
        .select(
          `
          event_id,
          created_at,
          event:event_id (
            id,
            title,
            start_date,
            end_date,
            start_time,
            end_time,
            cover_url,
            price_type,
            details,
            providers!provider_id (
              id,
              name,
              website_url,
              address
            )
          )
        `
        )
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter out any bookmarks where the event was deleted
      return (data || []).filter((bookmark) => bookmark.event);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to add bookmark (optimized)
  const addBookmarkMutation = useMutation({
    mutationFn: async ({
      profileId,
      eventId,
    }: {
      profileId: string;
      eventId: string;
    }) => {
      const { error } = await supabase.from("bookmarks").insert([
        {
          profile_id: profileId,
          event_id: eventId,
        },
      ]);

      if (error) throw error;
    },
    onMutate: ({ eventId }) => {
      // Optimistic update using React Query cache
      queryClient.setQueryData(["bookmarks", user?.id], (old: any[] = []) => {
        if (old.some((bookmark) => bookmark.event_id === eventId)) {
          return old; // Already exists
        }
        return [...old, { event_id: eventId }];
      });
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate and refetch both bookmark queries
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-events-details"],
      });
      toast.success("Event bookmarked successfully");
    },
    onError: (error: any, { eventId }) => {
      // Revert optimistic update
      queryClient.setQueryData(["bookmarks", user?.id], (old: any[] = []) => {
        return old.filter((bookmark) => bookmark.event_id !== eventId);
      });

      console.error("Error adding bookmark:", error);
      if (error.message?.includes("duplicate key")) {
        toast.error("Event is already bookmarked");
      } else {
        toast.error("Failed to bookmark event");
      }
    },
  });

  // Mutation to remove bookmark (optimized)
  const removeBookmarkMutation = useMutation({
    mutationFn: async ({
      profileId,
      eventId,
    }: {
      profileId: string;
      eventId: string;
    }) => {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("profile_id", profileId)
        .eq("event_id", eventId);

      if (error) throw error;
    },
    onMutate: ({ eventId }) => {
      // Optimistic update using React Query cache
      queryClient.setQueryData(["bookmarks", user?.id], (old: any[] = []) => {
        return old.filter((bookmark) => bookmark.event_id !== eventId);
      });
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-events-details"],
      });
      toast.success("Event removed from bookmarks");
    },
    onError: (error, { eventId }) => {
      // Revert optimistic update
      queryClient.setQueryData(["bookmarks", user?.id], (old: any[] = []) => {
        if (old.some((bookmark) => bookmark.event_id === eventId)) {
          return old; // Already exists
        }
        return [...old, { event_id: eventId }];
      });

      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    },
  });

  // Toggle bookmark function (optimized)
  const toggleBookmark = async (eventId: string) => {
    if (!user) return;

    const profile = await ensureUserProfile();
    if (!profile) return;

    const isCurrentlyBookmarked = bookmarkedEvents.has(eventId);

    try {
      if (isCurrentlyBookmarked) {
        removeBookmarkMutation.mutate({ profileId: profile, eventId });
      } else {
        addBookmarkMutation.mutate({ profileId: profile, eventId });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const loading =
    addBookmarkMutation.isPending || removeBookmarkMutation.isPending;

  return {
    isBookmarked,
    toggleBookmark,
    bookmarkedEventsDetails,
    refetchBookmarkedEvents,
    bookmarkedEventsLoading,
    loading,
    bookmarkedEvents: Array.from(bookmarkedEvents),
    isSignedIn: !!user,
  };
};
