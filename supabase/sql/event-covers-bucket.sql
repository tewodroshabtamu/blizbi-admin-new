-- Create event-covers bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-covers', 'event-covers', true);

-- Allow public read access to event covers
CREATE POLICY "Public read access for event covers" ON storage.objects
FOR SELECT USING (bucket_id = 'event-covers');

-- Allow authenticated users to upload event covers
CREATE POLICY "Authenticated users can upload event covers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'event-covers' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own event covers
CREATE POLICY "Authenticated users can update event covers" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'event-covers' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete event covers
CREATE POLICY "Authenticated users can delete event covers" ON storage.objects
FOR DELETE USING (
  bucket_id = 'event-covers' 
  AND auth.role() = 'authenticated'
); 