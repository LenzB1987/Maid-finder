import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface Contact {
  id: string;
  full_name: string;
  avatar_url: string;
  last_message?: string;
  unread_count: number;
}

const MessagesPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadContacts();
    if (userId) {
      loadContactInfo(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact.id);
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user!.id}`,
        }, payload => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          receiver_id,
          profiles!sender_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const uniqueContacts = new Map<string, Contact>();
      
      data?.forEach(message => {
        const contactId = message.sender_id === user!.id ? message.receiver_id : message.sender_id;
        if (!uniqueContacts.has(contactId)) {
          uniqueContacts.set(contactId, {
            id: contactId,
            full_name: message.profiles.full_name,
            avatar_url: message.profiles.avatar_url,
            unread_count: 0,
          });
        }
      });

      setContacts(Array.from(uniqueContacts.values()));
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadContactInfo = async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', contactId)
        .single();

      if (error) throw error;

      setSelectedContact({
        id: data.id,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        unread_count: 0,
      });
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  const loadMessages = async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          profiles!sender_id (
            full_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user!.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: user!.id,
          receiver_id: selectedContact.id,
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-12 min-h-[600px]">
          {/* Contacts Sidebar */}
          <div className="col-span-4 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <div className="overflow-y-auto h-[calc(600px-4rem)]">
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={contact.avatar_url || 'https://via.placeholder.com/48'}
                      alt={contact.full_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{contact.full_name}</h3>
                    {contact.last_message && (
                      <p className="text-sm text-gray-500 truncate">{contact.last_message}</p>
                    )}
                  </div>
                  {contact.unread_count > 0 && (
                    <div className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                      {contact.unread_count}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-8 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                      src={selectedContact.avatar_url || 'https://via.placeholder.com/40'}
                      alt={selectedContact.full_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{selectedContact.full_name}</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user!.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender_id === user!.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send size={20} />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a contact to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;