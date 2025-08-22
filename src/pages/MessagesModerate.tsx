import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, Lock, Calendar, MapPin, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  child_alias: string;
  school: string;
  region: string;
  language: string;
  text: string;
  media_urls: string[];
  media_types: string[];
  donor_tag: string;
  status: string;
  created_at: string;
  moderation_note: string;
  consent: {
    guardian: boolean;
    school: boolean;
    media_release: boolean;
  };
}

export default function MessagesModerate() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authenticated) {
      fetchPendingMessages();
    }
  }, [authenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, this would be more secure
    if (password === "reach2025admin") {
      setAuthenticated(true);
      toast({
        title: "Access granted",
        description: "Welcome to the moderation panel.",
      });
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
  };

  const fetchPendingMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages((data || []).map(msg => ({
        ...msg,
        media_urls: Array.isArray(msg.media_urls) ? msg.media_urls.map(url => String(url)) : [],
        media_types: Array.isArray(msg.media_types) ? msg.media_types.map(type => String(type)) : [],
        consent: typeof msg.consent === 'object' && msg.consent && !Array.isArray(msg.consent) ? msg.consent as any : { guardian: false, school: false, media_release: false },
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const moderateMessage = async (messageId: string, action: 'approve' | 'reject', note?: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          moderation_note: note || null
        })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      toast({
        title: `Message ${action}d`,
        description: `The message has been ${action}d successfully.`,
      });
    } catch (error) {
      console.error('Error moderating message:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} message.`,
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="w-full max-w-md mx-6">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-brand-primary" />
            <CardTitle>Moderation Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter moderation password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access Moderation Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-primary">Message Moderation</h1>
              <p className="text-text-muted mt-2">
                Review and approve thank you messages from children and teachers
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-primary">{messages.length}</div>
              <div className="text-sm text-text-muted">Pending messages</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p>Loading pending messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-brand-primary" />
              <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
              <p className="text-text-muted">No messages pending review at this time.</p>
              <Button 
                onClick={fetchPendingMessages}
                className="mt-4"
                variant="outline"
              >
                Refresh
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <Card key={message.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{message.child_alias}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                        {message.school && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {message.school}
                            {message.region && `, ${message.region}`}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Languages className="h-4 w-4 mr-1" />
                          {message.language === 'en' ? 'English' : message.language === 'zh' ? '中文' : 'Mixed'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {getTimeAgo(message.created_at)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Message Content */}
                  <div>
                    <h4 className="font-semibold mb-2">Message:</h4>
                    <p className="text-text leading-relaxed bg-surface-soft p-4 rounded-lg">
                      "{message.text}"
                    </p>
                  </div>

                  {/* Donor Tag */}
                  {message.donor_tag && (
                    <div>
                      <h4 className="font-semibold mb-2">For Donor:</h4>
                      <Badge>{message.donor_tag}</Badge>
                    </div>
                  )}

                  {/* Media */}
                  {message.media_urls.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Media ({message.media_urls.length} files):</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {message.media_urls.map((url, index) => (
                          <div key={index} className="rounded-lg overflow-hidden">
                            {message.media_types[index] === 'image' ? (
                              <img
                                src={`${supabase.storage.from('message-media').getPublicUrl(url).data.publicUrl}`}
                                alt="Message media"
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <video
                                src={`${supabase.storage.from('message-media').getPublicUrl(url).data.publicUrl}`}
                                className="w-full h-48 object-cover"
                                controls
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consent Status */}
                  <div>
                    <h4 className="font-semibold mb-2">Consent Status:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={message.consent.guardian ? "default" : "destructive"}>
                        Guardian: {message.consent.guardian ? "✓" : "✗"}
                      </Badge>
                      <Badge variant={message.consent.school ? "default" : "destructive"}>
                        School: {message.consent.school ? "✓" : "✗"}
                      </Badge>
                      <Badge variant={message.consent.media_release ? "default" : "destructive"}>
                        Media Release: {message.consent.media_release ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="border-t pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor={`note-${message.id}`}>Moderation Note (Optional)</Label>
                        <Textarea
                          id={`note-${message.id}`}
                          placeholder="Add a note about your decision..."
                          className="mt-2"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 sm:w-48">
                        <Button
                          onClick={() => {
                            const noteElement = document.getElementById(`note-${message.id}`) as HTMLTextAreaElement;
                            moderateMessage(message.id, 'approve', noteElement?.value);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        
                        <Button
                          onClick={() => {
                            const noteElement = document.getElementById(`note-${message.id}`) as HTMLTextAreaElement;
                            moderateMessage(message.id, 'reject', noteElement?.value);
                          }}
                          variant="destructive"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}