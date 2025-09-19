import React, { createContext, useContext, ReactNode } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkContextType {
  isBookmarked: (eventId: string) => boolean;
  toggleBookmark: (eventId: string) => void;
  bookmarkedEventsDetails: any[];
  refetchBookmarkedEvents: () => void;
  bookmarkedEventsLoading: boolean;
  loading: boolean;
  bookmarkedEvents: string[];
  isSignedIn: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const bookmarkData = useBookmarks();

  return (
    <BookmarkContext.Provider value={bookmarkData}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarkContext must be used within a BookmarkProvider');
  }
  return context;
}; 