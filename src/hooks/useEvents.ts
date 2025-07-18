
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './use-toast';
import type { Tables } from '@/integrations/supabase/types';

// Use the Supabase generated type as the base
type DatabaseEvent = Tables<'events'>;

export interface Event extends DatabaseEvent {
  event_type: 'fall' | 'near-fall' | 'confusion' | 'emergency' | 'other';
}

export interface CreateEventData {
  event_type: Event['event_type'];
  severity?: number;
  notes?: string;
  location?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadEvents = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('Error loading events:', error);
        toast({
          title: "Error loading events",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        return;
      }

      // Type assertion since we know the event_type will be one of our valid types
      setEvents((data as Event[]) || []);
    } catch (error) {
      console.error('Error in loadEvents:', error);
      toast({
        title: "Error loading data",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData): Promise<Event | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to log events",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          event_type: eventData.event_type,
          severity: eventData.severity || 1,
          notes: eventData.notes,
          location: eventData.location,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        toast({
          title: "Error logging event",
          description: "Please try again",
          variant: "destructive"
        });
        return null;
      }

      // Type assertion for the returned data
      const newEvent = data as Event;
      
      // Add to local state
      setEvents(prev => [newEvent, ...prev]);
      
      toast({
        title: "Event logged successfully",
        description: `${eventData.event_type.replace('-', ' ')} has been recorded`,
      });

      return newEvent;
    } catch (error) {
      console.error('Error in createEvent:', error);
      toast({
        title: "Error logging event",
        description: "Please try again",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateEvent = async (id: string, updates: Partial<CreateEventData>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('events')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating event:', error);
        toast({
          title: "Error updating event",
          description: "Please try again",
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...updates, updated_at: new Date().toISOString() } : event
      ));

      toast({
        title: "Event updated",
        description: "The event has been updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in updateEvent:', error);
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting event:', error);
        toast({
          title: "Error deleting event",
          description: "Please try again",
          variant: "destructive"
        });
        return false;
      }

      // Remove from local state
      setEvents(prev => prev.filter(event => event.id !== id));

      toast({
        title: "Event deleted",
        description: "The event has been removed",
      });

      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      return false;
    }
  };

  const getRecentEvents = (days: number = 7): Event[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return events.filter(event => 
      new Date(event.logged_at) >= cutoffDate
    );
  };

  const getEventsByType = (type: Event['event_type']): Event[] => {
    return events.filter(event => event.event_type === type);
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    getRecentEvents,
    getEventsByType,
    refetch: loadEvents
  };
};
